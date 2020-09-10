const router = require("express").Router();
let Patient = require("../models/patient.model");

/*Operation
dashboard - get all waiting patients
- redirect to dashboard page
search waiting patients - get all patients with opd_prescribed stage
- redirect to waiting patients search results page
issue drug - get all drugs prescribed from consultation
- redirect to issue drug page
- (after confirming) - update prescribed drug info
- using that info add drug actions and update drug balance
view opd drug list - get all drugs
- redirect to view all drugs page
search opd drug - find drugs with matching name
- redirect to search results page
view drug info - get drug with id
- redirect to view info page
add drug - add a drug with created action
- redirect add drug page
delete drug - delete drug with id
- redirect to show all drugs or dashboard
make a drug action - add a action to drug
- update quantity
- redirect to view drug info page
*/

//get all patients
router.route("/all_patients").get((req, res) => {
  Patient.find()
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a patient - not needed
router.route("/add").post((req, res) => {
  const nic = req.body.nic;
  const name = req.body.name;
  const dob = req.body.dob;
  const gender = req.body.gender;
  const address = req.body.address;
  const phone = req.body.phone;
  //const stage = req.body.stage; //not needed when adding
  //const consultation = req.body.consultation; //not needed when adding

  const newPatient = new Patient({
    nic,
    name,
    dob,
    gender,
    address,
    phone,
  });

  newPatient
    .save()
    .then(() => res.json("Patient added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update a patient

//delete a patient

module.exports = router;
