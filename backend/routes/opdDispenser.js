const router = require("express").Router();
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const auth = require("../middleware/auth");
let Patient = require("../models/patient.model");
let Consultation = require("../models/consultation.model");
let OpdDrug = require("../models/opdDrug.model");
let Drug = require("../models/opdDrug.model");

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
router.route("/all_patients").get(auth, (req, res) => {
  if (
    req.userData.unit !== "OPD" ||
    req.userData.post !== "Consultion Doctor"
  ) {
    throw new HttpError("You are not authorized", 401);
  }
  Patient.find()
    .sort({ name: 1 })
    .limit(20)
    .then((patients) => res.json(patients))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get waiting consultations
router.route("/waiting_consultations").get((req, res) => {
  // if (
  //   req.userData.unit !== "OPD" ||
  //   req.userData.post !== "Consultion Doctor"
  // ) {
  //   throw new HttpError("You are not authorized", 401);
  // }
  Consultation.find({ stage: "opd_prescribed" })
    .then((consultations) => res.json(consultations))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get a waiting patients
router.route("/waiting_patients/:id").get((req, res) => {
  // if (
  //   req.userData.unit !== "OPD" ||
  //   req.userData.post !== "Consultion Doctor"
  // ) {
  //   throw new HttpError("You are not authorized", 401);
  // }
  Patient.findById(req.params.id)
    .then((patient) => res.json(patient))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add a drug
router.route("/add").post(auth, (req, res) => {
  const drugName = req.body.drugName;
  const drugType = req.body.drugType;
  const availQuantity = req.body.availQuantity;
  const unit = req.body.unit;
  const dispenser = mongoose.Types.ObjectId(req.body.dispenser);

  const newDrug = new Drug({
    drugName,
    drugType,
    availQuantity,
    unit,
  });

  newDrug.drugActions.push({
    actionType: "add",
    amount: availQuantity,
    unit: unit,
    balance: availQuantity,
    remarks: "Added this drug to drug store",
    dispenser: dispenser,
  });

  newDrug
    .save()
    .then(() => res.json("drug added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
