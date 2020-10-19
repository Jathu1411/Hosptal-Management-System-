const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const HttpError = require("../models/http-error");
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");
let OpdDrug = require("../models/opdDrug.model");
let ClinicReference = require("../models/clinicReference.model");

/*IC Operation
****dashboard - normal consultant functions 
- redirect to dashboard
generate monthly statistic -  get all the patients, consultations, opd drugs
- calculate overall, patient, drug, disease summary
- redirect to generatedd monthly statistic page
*/

//get min date
router.route("/min_date").get(auth, (req, res) => {
  if (req.userData.unit !== "OPD" || req.userData.post !== "In Charge") {
    throw new HttpError("You are not authorized", 401);
  }
  Consultation.find()
    .sort({ createdAt: 1 })
    .limit(1)
    .then((consultations) => res.json(consultations[0].createdAt))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get patient summary
router.route("/patient_summary/:month/:year").get((req, res) => {
  // if (req.userData.unit !== "OPD" || req.userData.post !== "In Charge") {
  //   throw new HttpError("You are not authorized", 401);
  // }

  let month = req.params.month;
  const year = req.params.year;
  const result = {};

  Consultation.find({
    month: month,
    year: year,
  })
    .populate("patient")
    .then((consultations) => {
      let totalPatients = 0;
      let numMales = 0;
      let numFemales = 0;
      let numFirstVisit = 0;
      let numSecondVisit = 0;
      consultations.forEach((consultation) => {
        if (consultation.patient !== null) {
          ++totalPatients;
          if (consultation.patient.gender === "male") {
            ++numMales;
          }
          if (consultation.patient.gender === "female") {
            ++numFemales;
          }
          if (consultation.visTime === 1) {
            ++numFirstVisit;
          }
          if (consultation.visTime === 2) {
            ++numSecondVisit;
          }
        }
      });
      result.totalPatients = totalPatients;
      result.numMales = numMales;
      result.numFemales = numFemales;
      result.numFirstVisit = numFirstVisit;
      result.numSecondVisit = numSecondVisit;
      res.json(result);
    })
    .catch((err) => res.status(400).json("Error: " + err));

  //Promise.all([])
});

module.exports = router;
