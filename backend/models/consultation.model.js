const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const consultationSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    visTime: { type: Number, default: 1 },
    diseaseState: { type: String, trim: true },
    disease: { type: String, trim: true },
    notes: { type: String },
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
    consultant: { type: Schema.Types.ObjectId, ref: "User" },
    drugs: [
      {
        drugName: String,
        quantity: Number,
        unit: String,
        state: {
          type: String,
          enum: ["pending", "not_issued", "issued"],
          default: "pending",
        },
      },
    ],
    dispenser: { type: Schema.Types.ObjectId, ref: "User" },
    clinic: { type: Schema.Types.ObjectId, ref: "ClinicReference" },
    stage: {
      type: String,
      enum: [
        "consulted",
        "opd_prescribed",
        "opd_drug_issued",
        "ward_referenced",
        "clinic_referenced",
        "ward_admitted",
        "ward_discharged",
        "ward_transfered",
      ],
      default: "consulted",
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);
module.exports = Consultation;
