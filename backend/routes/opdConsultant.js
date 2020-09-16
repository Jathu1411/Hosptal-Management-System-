const router = require("express").Router();
const mongoose = require("mongoose");
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");
let OpdDrug = require("../models/opdDrug.model");
let ClinicReference = require("../models/clinicReference.model");

const auth = require("../middleware/auth");

/*Operation
****dashboard - get all waiting patients
- redirect to dashboard page
****search all patients - get all patients
- redirect to all patients search results page
****search waiting patients - get all patients with registered stage
- redirect to waiting patients search results page
****view patient details - get a particular patient
- get all the consultations of that patient
- redirect to view patient details page
view patient visit details - view all already available info(FE)
****consult - create a consultation(with reference)
- change patient stage to in treatment
- redirect to prescribe/reference to clinic/dashboard(admission)
****prescribe - get all opd drugs
- add received drugs list to consultation
- change the stage to opd prescribed
****reference to clinic - create a reference to clinic(with reference)
- stage to clinic referenced
- redirect to dashboard
****reference to admission - change the stage to ward referenced
- redirect to dashboard
*/

//get all waiting patients
router.route("/waiting_patients").get((req, res) => {
  Patient.find({ stage: "registered" })
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all matching waiting patients by name
router.route("/waiting_patients/name/:key").get((req, res) => {
  Patient.find({
    name: { $regex: req.params.key, $options: "i" },
    stage: "registered",
  })
    .sort({ name: 1 })
    .limit(10)
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all matching waiting patients by nic
router.route("/waiting_patients/nic/:key").get((req, res) => {
  Patient.find({
    nic: { $regex: req.params.key, $options: "i" },
    stage: "registered",
  })
    .sort({ name: 1 })
    .limit(10)
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

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

//add a consultation
router.route("/add").post((req, res) => {
  const visTime = req.body.visTime;
  const diseaseState = req.body.diseaseState;
  const disease = req.body.disease;
  const notes = req.body.notes;
  const patient = mongoose.Types.ObjectId(req.body.patientId); //might convert
  const consultant = mongoose.Types.ObjectId(req.body.consultant); //might use mongoose.Types.ObjectId('')

  const newConsultation = new Consultation({
    visTime,
    diseaseState,
    disease,
    notes,
    patient,
    consultant,
  });

  newConsultation
    .save()
    .then(() => {
      Patient.findById(req.body.patientId)
        .then((patientFor) => {
          patientFor.consultations.push(newConsultation);
          patientFor
            .save()
            .then(() => {
              Patient.findByIdAndUpdate(req.body.patientId, {
                stage: "in_treatment",
              }).then(() => res.json(newConsultation._id));
            })
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//refer patient to ward
router.route("/ward/:conId").post((req, res) => {
  Consultation.findByIdAndUpdate(req.params.conId, {
    stage: "ward_referenced",
  })
    .then(() => res.json("success"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all opd drugs
router.route("/prescribe/drugs").get((req, res) => {
  OpdDrug.find()
    .then((opdDrugs) => res.json(opdDrugs))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get a consultation
router.route("/consultation/:conId").get((req, res) => {
  Consultation.findById(req.params.conId)
    .then((consultation) => res.json(consultation))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all matching opd drugs
router.route("/prescribe/drugs/:key").get((req, res) => {
  OpdDrug.find({ drugName: { $regex: req.params.key, $options: "i" } })
    .sort({ drugName: 1 })
    .limit(10)
    .then((drugs) => res.json(drugs))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a prescription to consultation
router.route("/prescribe/:conId").post((req, res) => {
  Consultation.findById(req.params.conId)
    .then((consultation) => {
      const drugArr = req.body;
      drugArr.forEach((drug) => {
        consultation.drugs.push({
          drugName: drug.drugName,
          quantity: drug.quantity,
          unit: drug.unit,
          state: "pending",
        });
      });

      consultation.stage = "opd_prescribed";

      consultation
        .save()
        .then(() => res.json("success"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all clinic references - not needed
router.route("/all_crefs").get((req, res) => {
  ClinicReference.find()
    .then((clinicReferences) => res.json(clinicReferences))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a clinic references
router.route("/add_cref/:conId").post((req, res) => {
  const reasons = req.body.reasons;
  const treatmentsProvided = req.body.treatmentsProvided;
  const consultation = mongoose.Types.ObjectId(req.params.conId); //consultation id - might convert

  const newClinicReference = new ClinicReference({
    reasons,
    treatmentsProvided,
    consultation,
  });

  newClinicReference
    .save()
    .then(() => {
      Consultation.findByIdAndUpdate(req.params.conId, {
        stage: "clinic_referenced",
      })
        .then(() => res.json("success"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
