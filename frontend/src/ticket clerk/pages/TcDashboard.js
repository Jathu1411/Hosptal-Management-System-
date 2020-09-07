import React from "react";

import Box from "../../shared/components/Box";
import Button from "../../shared/components/Button";
import PatientRegistrationForm from "../components/PatientRegistrationForm";

import "./TcDashboard.css";

const TcDashboard = () => {
  return (
    <div>
      <Box heading="Ticket clerk Dashboard">
        <div className="tc_dashboard_section_1">
          <div className="view_all_patients_button_holder">
            <Button text="View All Patients" importance="red"></Button>
          </div>
          <div className="search_all_patients_bar">
            <h2>*search bar*</h2>
          </div>
        </div>
        <hr />
        <div className="tc_dashboard_section_2">
          <PatientRegistrationForm />
        </div>
      </Box>
    </div>
  );
};

export default TcDashboard;
