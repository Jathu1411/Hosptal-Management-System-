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
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

//import created routes here
const usersRouter = require("./routes/users");
const opdTicketClerkRouter = require("./routes/opdTicketClerk");
// const opdConsultantRouter = require("./routes/opdConsultant");
// const opdDispenserRouter = require("./routes/opdDispenser");
// const opdInchargeRouter = require("./routes/opdIncharge");
// const admissionDoctorRouter = require("./routes/admissionDoctor");

//assign routes to use
app.use("/api/users", usersRouter);
app.use("/api/opd_tc", opdTicketClerkRouter);
// app.use("/opd_consultant", opdConsultantRouter);
// app.use("/opd_dispenser", opdDispenserRouter);
// app.use("/opd_incharge", opdInchargeRouter);
// app.use("/admission", admissionDoctorRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
