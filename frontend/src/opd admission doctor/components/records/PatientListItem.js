import React from "react";
import Moment from "moment";

export default function PatientListItem(props) {
  return (
    <tr onClick={() => props.link(props.patient._id, props.consultationId)}>
      <td>{props.patient.name}</td>
      <td>{props.patient.nic}</td>
      <td>{Moment().diff(props.patient.dob, "years")}</td>
      <td>{props.patient.address}</td>
      <td>{props.patient.gender}</td>
    </tr>
  );
}
