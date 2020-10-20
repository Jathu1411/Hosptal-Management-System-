import React from "react";

export default function DrugSummaryItem(props) {
  return (
    <tr onClick={(e) => e.preventDefault()}>
      <td>{props.summary.name}</td>
      <td>{props.summary.quantity}</td>
      <td>{props.summary.unit}</td>
    </tr>
  );
}
