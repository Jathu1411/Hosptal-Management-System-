const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const admissionSchema = new Schema(
  {
    civilCondition: {
      type: String,
      enum: ["married", "unmarried", "divorced"],
    },
    birthPlace: String,
    religion: String,
    nationality: String,
    occupataion: String,
    guardian: String,
    income: { type: Number, default: 0 },
    caseNo: { type: String, trim: true },
    inventory: String,
    housePhysician: String,
    complaint: { type: String, trim: true },
    complaintDuration: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "value is not an integer value",
      },
    },
    ward: { type: String, enum: ["male", "female"] },
    modeOfOnset: { type: String, trim: true },
    state: { type: String, default: "admitted" },
    initialDietPlan: String,
    notes: String,
    consultation: { type: Schema.Types.ObjectId, ref: "Consultation" },
  },
  { timestamps: true }
);

const Admission = mongoose.model("Admission", admissionSchema);
module.exports = Admission;
