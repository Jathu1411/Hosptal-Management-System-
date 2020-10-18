const router = require("express").Router();
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const auth = require("../middleware/auth");
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");
let Admission = require("../models/admission.model");

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
admit a patient - create a admission
- change stage to ward_admitted
- redirect to dashboard
*/

//get all waiting consultations
router.route("/waiting_consultations").get(auth, (req, res) => {
  if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
    throw new HttpError("You are not authorized", 401);
  }
  //console.log(hi);
  Consultation.find({ stage: "ward_referenced" })
    .then((consultations) => res.json(consultations))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/waiting_patients/:id").get((req, res) => {
  // if (req.userData.unit !== "OPD" || req.userData.post !== "Admission Doctor") {
  //   throw new HttpError("You are not authorized", 401);
  // }
  Patient.findById(req.params.id)
    .then((patient) => res.json(patient))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
