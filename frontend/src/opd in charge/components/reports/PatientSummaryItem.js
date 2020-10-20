import React from "react";

export default function PatientSummaryItem(props) {
  return (
    <tr onClick={(e) => e.preventDefault()}>
      <td>
        {props.summary.date}/{props.summary.month}/{props.summary.year}
      </td>
      <td>{props.summary.visit1}</td>
      <td>{props.summary.visit2}</td>
      <td>{props.summary.visit2}</td>
      <td>{props.summary.total}</td>
    </tr>
  );
}
