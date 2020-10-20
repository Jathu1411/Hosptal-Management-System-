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

  const dates = [];

  for (let index = 1; index <= 31; index++) {
    dates.push({ date: index, month: month, year: year });
  }

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

      const queries1 = dates.map((day) => {
        return Consultation.find({
          date: day.date,
          month: day.month,
          year: day.year,
        }).countDocuments();
      });

      Promise.all(queries1).then((results1) => {
        const queries2 = dates.map((day) => {
          return Consultation.find({
            date: day.date,
            month: day.month,
            year: day.year,
            visTime: 1,
          }).countDocuments();
        });

        Promise.all(queries2).then((results2) => {
          const queries3 = dates.map((day) => {
            return Consultation.find({
              date: day.date,
              month: day.month,
              year: day.year,
              visTime: 2,
            }).countDocuments();
          });

          Promise.all(queries3).then((results3) => {
            const queries4 = dates.map((day) => {
              return Consultation.find({
                date: day.date,
                month: day.month,
                year: day.year,
                visTime: 3,
              }).countDocuments();
            });

            Promise.all(queries4).then((results4) => {
              for (let c = 0; c < dates.length; c++) {
                dates[c].total = results1[c];
                dates[c].visit1 = results2[c];
                dates[c].visit2 = results3[c];
                dates[c].visit3 = results4[c];
              }
              result.dateSummary = dates;
              res.json(result);
            });
          });
        });
      });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//get drug summary
router.route("/drug_summary/:month/:year").get((req, res) => {
  // if (req.userData.unit !== "OPD" || req.userData.post !== "In Charge") {
  //   throw new HttpError("You are not authorized", 401);
  // }

  let month = parseInt(req.params.month);
  const year = parseInt(req.params.year);
  const result = [];

  OpdDrug.find()
    .then((drugs) => {
      drugs.forEach((drug) => {
        const drugDetail = {};
        drugDetail.name = drug.drugName;
        drugDetail.unit = drug.unit;
        let quantity = 0.0;
        drug.drugActions.forEach((drugAction) => {
          if (
            drugAction.month === month &&
            drugAction.year === year &&
            drugAction.actionType === "issue"
          ) {
            quantity += drugAction.amount;
          }
        });
        drugDetail.quantity = quantity;
        result.push(drugDetail);
      });
      res.json(result);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//get disease summary
router.route("/disease_summary/:month/:year").get((req, res) => {
  // if (req.userData.unit !== "OPD" || req.userData.post !== "In Charge") {
  //   throw new HttpError("You are not authorized", 401);
  // }

  let month = req.params.month;
  const year = req.params.year;
  const result = [];

  Consultation.find({
    month: month,
    year: year,
  })
    .distinct("disease")
    .then((diseases) => {
      const queries1 = diseases.map((disease) => {
        return Consultation.find().populate("patient").countDocuments({
          month: month,
          year: year,
          disease: disease,
        });
      });

      Promise.all(queries1).then((results1) => {
        const queries2 = diseases.map((disease) => {
          return Consultation.find({
            month: month,
            year: year,
            disease: disease,
            ageAtTheTime: { $gte: 0, $lt: 1 },
          }).countDocuments();
        });

        Promise.all(queries2).then((results2) => {
          const queries3 = diseases.map((disease) => {
            return Consultation.find({
              month: month,
              year: year,
              disease: disease,
              ageAtTheTime: { $gte: 1, $lte: 4 },
            }).countDocuments();
          });

          Promise.all(queries3).then((results3) => {
            const queries4 = diseases.map((disease) => {
              return Consultation.find({
                month: month,
                year: year,
                disease: disease,
                ageAtTheTime: { $gte: 5, $lte: 16 },
              }).countDocuments();
            });

            Promise.all(queries4).then((results4) => {
              const queries5 = diseases.map((disease) => {
                return Consultation.find({
                  month: month,
                  year: year,
                  disease: disease,
                  ageAtTheTime: { $gte: 17, $lte: 49 },
                }).countDocuments();
              });

              Promise.all(queries5).then((results5) => {
                const queries6 = diseases.map((disease) => {
                  return Consultation.find({
                    month: month,
                    year: year,
                    disease: disease,
                    ageAtTheTime: { $gte: 60, $lte: 69 },
                  }).countDocuments();
                });

                Promise.all(queries6).then((results6) => {
                  const queries7 = diseases.map((disease) => {
                    return Consultation.find({
                      month: month,
                      year: year,
                      disease: disease,
                      ageAtTheTime: { $gt: 70 },
                    }).countDocuments();
                  });

                  Promise.all(queries7).then((results7) => {
                    for (let c = 0; c < diseases.length; c++) {
                      const disease = {};
                      disease.type = diseases[c];
                      disease.total = results1[c];
                      disease.val1 = results2[c];
                      disease.val2 = results3[c];
                      disease.val3 = results4[c];
                      disease.val4 = results5[c];
                      disease.val5 = results6[c];
                      disease.val6 = results7[c];
                      result.push(disease);
                    }
                    res.json(result);
                  });
                });
              });
            });
          });
        });
      });
    });
});

module.exports = router;
