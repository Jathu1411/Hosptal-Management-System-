const router = require("express").Router();
const HttpError =  require("../models/http-error");
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");

const auth = require("../middleware/auth");

/*Operation
****view all patients - get all patients ---- add pagination
- redirect to view all patients page
****search patients - get matching patients by nic
- redirect to search results page
****register patient - add a patient
- redirect to dashboard
****view patient details - get a particular patient
- redirect to view patient details page
****update patient details  
- update patient details of given patient id
- redirect to view patient details
add to the consultation -
- update stage info of a given patient id
- redirect to dashboard/view all patients
***delete patient - delete patient of a given patient id
- redirect to dashboard
*/

//get all patients
router.route("/all_patients").get(auth, (req, res) => {
  Patient.find()
    .sort({ name: 1 })
    .limit(20)
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all matching patients by name
router.route("/all_patients/name/:key").get((req, res) => {
  Patient.find({ name: { $regex: req.params.key, $options: "i" } })
    .sort({ name: 1 })
    .limit(10)
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all matching patients by nic
router.route("/all_patients/nic/:key").get((req, res) => {
  Patient.find({ nic: { $regex: req.params.key, $options: "i" } })
    .sort({ name: 1 })
    .limit(10)
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//check whether a patient nic exists
router.route("/patient_exist/:nic").get((req, res) => {
  if (req.params.nic !== "") {
    Patient.exists({ nic: req.params.nic })
      .then((result) => res.json(result))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    res.json(false);
  }
});

//get a patient
router.route("/:id").get((req, res) => {
  Patient.findById(req.params.id)
    .then((patient) => res.json(patient))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get a patient's consultations
router.route("/consultations/:id").get((req, res) => {
  Consultation.find({ patient: req.params.id })
    .then((consultations) => res.json(consultations))
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
    .then(() => res.json("success"))
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
      // patient.stage = req.body.stage;

      patient
        .save()
        .then(() => res.json("success"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//delete a patient
router.route("/:id").delete((req, res) => {
  Patient.findByIdAndDelete(req.params.id)
    .then((patient) => res.json("success"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a patient to consultation
router.route("/consult/:id").post((req, res) => {
  Patient.findByIdAndUpdate(req.params.id, { stage: "registered" })
    .then((patient) => res.json("success"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
