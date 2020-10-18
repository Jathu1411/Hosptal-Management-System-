const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

//import created routes here
const usersRouter = require("./routes/users");
const opdTicketClerkRouter = require("./routes/opdTicketClerk");
const opdConsultantRouter = require("./routes/opdConsultant");
const opdDispenserRouter = require("./routes/opdDispenser");
const admissionDoctorRouter = require("./routes/admissionDoctor");
const opdInchargeRouter = require("./routes/opdIncharge");

//assign routes to use
app.use("/api/users", usersRouter);
app.use("/api/opd_tc", opdTicketClerkRouter);
app.use("/api/opd_consultant", opdConsultantRouter);
app.use("/api/opd_dispenser", opdDispenserRouter);
app.use("/api/admission", admissionDoctorRouter);
app.use("/api/opd_incharge", opdInchargeRouter);

//error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
