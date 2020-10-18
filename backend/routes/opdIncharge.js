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

module.exports = router;
