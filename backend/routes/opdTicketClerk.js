const router = require("express").Router();
let Patient = require("../models/patient.model");

const auth = require("../middleware/auth");

/*Operation
view all patients - get all patients
- redirect to view all patients page
search patients - get matching patients by nic
- redirect to search results page
register patient - add a patient
- redirect to dashboard
view patient details - get a particular patient
- redirect to view patient details page
update patient details  
- update patient details of given patient id
- redirect to view patient details
add to the consultation -
- update stage info of a given patient id
- redirect to dashboard/view all patients
delete patient - delete patient of a given patient id
- redirect to dashboard
*/

//get all patients
router.route("/all_patients").get(auth, (req, res) => {
  Patient.find()
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a patient
router.route("/add").post((req, res) => {
  const nic = req.body.nic;
  const name = req.body.name;
  const dob = Date.parse(req.body.dob);
  const gender = req.body.gender;
  const address = req.body.address;
  const phone = req.body.phone;
  const stage = req.body.stage; //not needed when adding
  //const consultation = req.body.consultation; //not needed when adding

  const newPatient = new Patient({
    nic,
    name,
    dob,
    gender,
    address,
    phone,
    stage,
  });

  newPatient
    .save()
    .then(() => res.json("Patient added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get a patient
router.route("/:id").get((req, res) => {
  Patient.findById(req.params.id)
    .then((patient) => res.json(patient))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update a patient
router.route("/update/:id").post((req, res) => {
  Patient.findById(req.params.id)
    .then((patient) => {
      patient.nic = req.body.nic;
      patient.name = req.body.name;
      patient.dob = Date.parse(req.body.dob);
      patient.gender = req.body.gender;
      patient.address = req.body.address;
      patient.phone = req.body.phone;
      patient.stage = req.body.stage;

      patient
        .save()
        .then(() => res.json("Patient updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//delete a patient
router.route("/:id").delete((req, res) => {
  Patient.findByIdAndDelete(req.params.id)
    .then((patient) => res.json("Patient deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
