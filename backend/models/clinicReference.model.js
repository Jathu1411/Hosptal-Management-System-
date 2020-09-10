const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clinicReferenceSchema = new Schema(
  {
    reasons: String,
    treatmentsProvided: String,
    consultation: { type: Schema.Types.ObjectId, ref: "Consultation" },
    clinicVisits: [{ type: Schema.Types.ObjectId, ref: "ClinicVisit" }],
  },
  { timestamps: true }
);

const ClinicReference = mongoose.model(
  "ClinicReference",
  clinicReferenceSchema
);
module.exports = ClinicReference;
