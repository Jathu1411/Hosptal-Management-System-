import React from "react";
import Moment from "moment";

export default function SearchPatientListItem(props) {
  return (
    <tr onClick={() => props.link(props.patient.pid, props.consultationId)}>
      <td>{props.patient.name}</td>
      <td>{props.patient.nic}</td>
      <td>{Moment().diff(props.patient.dob, "years")}</td>
      <td>{props.patient.address}</td>
      <td>{props.patient.gender}</td>
    </tr>
  );
}
