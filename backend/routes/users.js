const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

require("dotenv").config();

let User = require("../models/user.model");

/*Operation
login - find a particular user for a username
- verify password
- redirect to relevant dashboard
view account info - find a particular user by id
update account info - find a particular user by id
- update account info
- redirect to upate page
add a user(done by EMS) - add a user
- redirect to add user page //not needed by me
*/

//get all users
router.route("/all_users").get(auth, (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get a particular user and data
router.route("/").get(auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//register a user
router.route("/register").post((req, res) => {
  const { username, password, name, nic, post, unit, phone, grade } = req.body;

  if (!username || !password || !name || !nic) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }

  //check whether user is already existing
  User.findOne({ username }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      username,
      password,
      name,
      nic,
      post,
      unit,
      phone,
      grade,
    });
    //hashing the password
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            jwt.sign(
              {
                id: user.id,
                username: user.username,
                nic: user.nic,
                name: user.name,
                post: user.post,
                unit: user.unit,
              },
              process.env.JWT_SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    username: user.username,
                    id: user.id,
                    name: user.name,
                    nic: user.nic,
                    post: user.post,
                    unit: user.unit,
                  },
                });
              }
            );
          })
          .catch((err) => res.status(400).json("Error: " + err));
      });
    });
  });
});

//authenticate a user
router.route("/auth").post((req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }

  //check whether user is already existing
  User.findOne({ username }).then((user) => {
    if (!user) return res.status(400).json({ msg: "Invalid username" });

    //validating password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        {
          id: user.id,
          username: user.username,
          nic: user.nic,
          name: user.name,
          post: user.post,
          unit: user.unit,
        },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              username: user.username,
              id: user.id,
              name: user.name,
              nic: user.nic,
              post: user.post,
              unit: user.unit,
            },
          });
        }
      );
    });
  });
});

//check whether token is valid
router.route("/tokenIsValid").post((req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update a user

//delete a user

module.exports = router;
