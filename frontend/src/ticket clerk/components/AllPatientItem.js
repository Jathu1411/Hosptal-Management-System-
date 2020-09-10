import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Button from "../../shared/components/Button";
import "./AllPatientItem.css";

const AllPatientItem = (props) => {
  const [redirect, setRedirect] = useState(null);

  return (
    <tr
      onClick={() => {
        setRedirect(`/opd_patients/:${props.nic}`);
        console.log(redirect);
      }}
    >
      {redirect ? <Redirect to={redirect} /> : null}
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
        <a href="http://localhost:3000/">
          <Button text="To consultation"></Button>
        </a>
      </td>
      <td id="button_in_table">
        <a href="http://localhost:3000/">
          <Button text="Edit"></Button>
        </a>
      </td>
    </tr>
  );
};

export default AllPatientItem;
