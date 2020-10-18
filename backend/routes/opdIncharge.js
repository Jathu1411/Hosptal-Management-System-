const router = require("express").Router();
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const auth = require("../middleware/auth");
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");
let Admission = require("../models/admission.model");

/*Operation
dashboard - normal consultant functions 
- redirect to dashboard
generate monthly statistic -  get all the patients, consultations, opd drugs
- calculate overall, patient, drug, disease summary
- redirect to generatedd monthly statistic page
*/

module.exports = router;
