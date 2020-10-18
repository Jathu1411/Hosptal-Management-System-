const router = require("express").Router();
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const auth = require("../middleware/auth");
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");
let Admission = require("../models/admission.model");
let User = require("../models/user.model");

/*Operation
****dashboard - get all waiting patients
- redirect to dashboard page
****search waiting patients - get all patients with ward_referenced stage
- redirect to waiting patients search results page
view all admitted patients - get all patients with ward_admitted stage
- redirect to view all admitted patients page
search all ward admitted patients - get all patients with ward_admitted stage
- redirect to ward admitted patients search results page
view all ward patients - get all the patients with ward stage
- redirect to view all ward patients page
search all ward patients - get all patients with ward stage
- redirect to ward patients search results page
view patient admission info - get patient, consultation, admission of id
- redirect to view patient admission info page
****admit a patient - create a admission
- change stage to ward_admitted
- redirect to dashboard
*/

//get all waiting consultations
router.route("/waiting_consultations").get(auth, (req, res) => {
  if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
    throw new HttpError("You are not authorized", 401);
  }
  Consultation.find({ stage: "ward_referenced" })
    .then((consultations) => res.json(consultations))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get a waiting patient
router.route("/waiting_patients/:id").get((req, res) => {
  // if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
  //   throw new HttpError("You are not authorized", 401);
  // }
  Patient.findById(req.params.id)
    .then((patient) => res.json(patient))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get a particular opd physician
router.route("/user/:id").get(auth, (req, res) => {
  if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
    throw new HttpError("You are not authorized", 401);
  }
  User.findById(req.params.id)
    .select("name")
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a admission
router.route("/add").post(auth, (req, res) => {
  if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
    throw new HttpError("You are not authorized", 401);
  }
  const civilCondition = req.body.civilCondition;
  const birthPlace = req.body.birthPlace;
  const religion = req.body.religion;
  const nationality = req.body.nationality;
  const occupataion = req.body.occupataion;
  const guardian = req.body.guardian;
  const income = req.body.income;
  const caseNo = req.body.caseNo;
  const inventory = req.body.inventory;
  const housePhysician = req.body.housePhysician;
  const complaint = req.body.complaint;
  const complaintDuration = req.body.complaintDuration;
  const ward = req.body.ward;
  const modeOfOnset = req.body.modeOfOnset;
  const initialDietPlan = req.body.initialDietPlan;
  const notes = req.body.notes;
  console.log(req.body.consultation);
  const consultation = mongoose.Types.ObjectId(req.body.consultation);
  const admittedBy = mongoose.Types.ObjectId(req.body.admittedBy);

  const newAdmission = new Admission({
    civilCondition,
    birthPlace,
    religion,
    nationality,
    occupataion,
    guardian,
    income,
    caseNo,
    inventory,
    housePhysician,
    complaint,
    complaintDuration,
    ward,
    modeOfOnset,
    initialDietPlan,
    notes,
    consultation,
    admittedBy,
  });

  newAdmission
    .save()
    .then(() => {
      Consultation.findByIdAndUpdate(req.body.consultation, {
        stage: "ward_admitted",
      })
        .then(() => res.json("success"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all admitted consulatations - limit
router.route("/admitted_consultations").get(auth, (req, res) => {
  if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
    throw new HttpError("You are not authorized", 401);
  }
  Consultation.find({
    $or: [
      { stage: "ward_admitted" },
      { stage: "ward_discharged" },
      { stage: "ward_transfered" },
    ],
  })
    .limit(10)
    .then((consultations) => res.json(consultations))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get all admitted consultations with patient details - no limit
router.route("/admitted_consultations_patients").get((req, res) => {
  // if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
  //   throw new HttpError("You are not authorized", 401);
  // }
  Consultation.find({
    $or: [
      { stage: "ward_admitted" },
      { stage: "ward_discharged" },
      { stage: "ward_transfered" },
    ],
  })
    .populate("patient")
    .then((consultations) => {
      const wardPatients = [];
      consultations.forEach((consultation) => {
        wardPatients.push({
          conId: consultation._id,
          pid: consultation.patient._id,
          name: consultation.patient.name,
          nic: consultation.patient.nic,
          dob: consultation.patient.dob,
          address: consultation.patient.address,
          gender: consultation.patient.gender,
        });
      });
      res.json(wardPatients);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
