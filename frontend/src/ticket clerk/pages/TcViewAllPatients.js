import React from "react";

import Box from "../../shared/components/Box";
import AllPatientList from "../components/AllPatientList";
import "./TcViewAllPatients.css";

const TcViewAllPatients = () => {
  //dummy patient data
  const PATIENTS = [
    {
      id: "p1",
      NIC: "961234567V",
      name: "John. S",
      DOB: "1980-08-24",
      gender: "male",
      address: "Colombo",
      phone: "0771234567",
      stage: "registered",
      previousVisits: 2,
      lastVisit: "2020-02-01",
    },
    {
      id: "p2",
      NIC: "962345671V",
      name: "Ann. S",
      DOB: "1965-08-05",
      gender: "female",
      address: "Galle",
      phone: "0772345671",
      stage: "OPD consulted",
      previousVisits: 2,
      lastVisit: "2020-03-01",
    },
    {
      id: "p3",
      NIC: "963456712V",
      name: "Bill. S",
      DOB: "1985-08-24",
      gender: "male",
      address: "Colombo",
      phone: "0771234567",
      stage: "OPD prescribed",
      previousVisits: 2,
      lastVisit: "2020-04-01",
    },
  ];

  return (
    <div>
      <Box heading="All Registered Patients">
        <div className="tc_view_all_patients_section_1"></div>
        <div className="tc_view_all_patients_section_2">
          <AllPatientList items={PATIENTS} />
        </div>
      </Box>
    </div>
  );
};

export default TcViewAllPatients;
