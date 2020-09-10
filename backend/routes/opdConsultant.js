const router = require("express").Router();
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");
let OpdDrug = require("../models/opdDrug.model");
let ClinicReference = require("../models/clinicReference.model");

/*Operation
dashboard - get all waiting patients
- redirect to dashboard page
search all patients - get all patients
- redirect to all patients search results page
search waiting patients - get all patients with registered stage
- redirect to waiting patients search results page
view patient details - get a particular patient
- get all the consultations of that patient
- redirect to view patient details page
view patient visit details - view all already awailable info(FE)
consult - create a consultation(with reference)
- change patient stage to in treatment
- redirect to prescribe/reference to clinic/dashboard(admission)
prescribe - get all opd drugs
- add received drugs list to consultation
- change the stage to opd prescribed
reference to clinic - create a reference to clinic(with reference)
- stage to clinic referenced
- redirect to dashboard
reference to admission - change the stage to ward referenced
- redirect to dashboard
*/

//get all patients
router.route("/all_patients").get((req, res) => {
  Patient.find()
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a patient - won't add
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

//get all consultations - not needed
router.route("/all_consultations").get((req, res) => {
  Consultation.find()
    .then((consultations) => res.json(consultations))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a consultation - won't add
router.route("/add").post((req, res) => {
  //const date = req.body.date;//added automatically
  //const visTime = req.body.visTime;//have to calculated add registration
  const diseaseState = req.body.diseaseState;
  const disease = req.body.disease;
  const notes = req.body.notes;
  const patient = req.body.patient; //might convert
  const consultant = req.body.consultant; //might use mongoose.Types.ObjectId('')
  //const drugs = req.body.drugs;//array of prescribed drugs not added
  //const dispenser = req.body.dispenser;//added when issueing drugs
  //const clinic = req.body.clinic;//added when referencing to clinic
  //const stage = req.body.stage;//added automatically at insert

  const newConsultation = new Consultation({
    diseaseState,
    disease,
    notes,
    patient,
    consultant,
  });

  newConsultation
    .save()
    .then(() => res.json("consultation added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all opd drugs
router.route("/prescribe").get((req, res) => {
  OpdDrug.find()
    .then((opdDrugs) => res.json(opdDrugs))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all clinic references - not needed
router.route("/all_crefs").get((req, res) => {
  ClinicReference.find()
    .then((clinicReferences) => res.json(clinicReferences))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a clinic references - won't add
router.route("/add_cref").post((req, res) => {
  const reasons = req.body.reasons;
  const treatmentsProvided = req.body.treatmentsProvided;
  const consultation = req.body.consultation; //consultation id - might convert
  //const clinicVisits = req.body.clinicVisits;//added when visiting

  const newClinicReference = new ClinicReference({
    reasons,
    treatmentsProvided,
    consultation,
  });

  newClinicReference
    .save()
    .then(() => res.json("clinic reference added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
