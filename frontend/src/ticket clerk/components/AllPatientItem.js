import React from "react";

import Button from "../../shared/components/Button";
import "./AllPatientItem.css";

const AllPatientItem = (props) => {
  // const calcAge = (dob) => {
  //   let today = new Date();
  //   let birthDate = new Date(dob);
  //   console.log(today.getFullYear() - birthDate.getFullYear());
  //   return (today.getFullYear() - birthDate.getFullYear()).toString;
  // };

  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.nic}</td>
      <td>
        {String(new Date().getFullYear() - new Date(props.dob).getFullYear())}
      </td>
      <td>{props.address}</td>
      <td>{props.gender}</td>
      <td>{props.previousVisits}</td>
      <td>{props.lastVisit}</td>
      <td id="button_in_table">
        <Button text="To consultation"></Button>
      </td>
      <td id="button_in_table">
        <Button text="Edit"></Button>
      </td>
    </tr>
  );
};

export default AllPatientItem;
