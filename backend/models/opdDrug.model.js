const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opdDrugSchema = new Schema(
  {
    drugName: { type: String, unique: true, trim: true, lowercase: true },
    drugType: { type: String },
    availQuantity: { type: Number, default: 0 },
    unit: { type: String, trim: true, lowercase: true },
    drugActions: [
      {
        actionType: { type: String, enum: ["issue", "add", "remove"] },
        amount: { type: Number, default: 0 },
        unit: String,
        balance: { type: Number, default: 0 },
        remarks: String,
        dateTime: { type: Date, default: Date.now },
        dispenser: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

const OpdDrug = mongoose.model("OpdDrug", opdDrugSchema);
module.exports = OpdDrug;
