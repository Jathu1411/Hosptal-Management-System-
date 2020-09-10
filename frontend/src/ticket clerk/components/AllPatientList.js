import React from "react";

import AllPatientItem from "./AllPatientItem";
import "./AllPatientList.css";

const AllPatientList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="no_item_message">
        <h2>No patients registered yet</h2>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table_style">
        <thead>
          <tr>
            <th>Name</th>
            <th>NIC number</th>
            <th>Age</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Previous Visits</th>
            <th>Last Visit</th>
            <th>To Consultation</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {props.items.map((patient) => {
            return (
              <AllPatientItem
                key={patient.id}
                nic={patient.NIC}
                name={patient.name}
                dob={patient.DOB}
                address={patient.address}
                gender={patient.gender}
                previousVisits={patient.previousVisits}
                lastVisit={patient.lastVisit}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllPatientList;
