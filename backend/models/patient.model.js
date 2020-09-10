const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    nic: {
      type: String,
      required: [true, "NIC number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "DOB is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    stage: {
      type: String,
      enum: ["registered", "in_treatment", "treated"],
      default: "registered",
    },
    consultations: [{ type: Schema.Types.ObjectId, ref: "Consultation" }],
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
