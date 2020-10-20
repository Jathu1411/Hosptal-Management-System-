import React from "react";

export default function DiseaseSummaryItem(props) {
  return (
    <tr onClick={(e) => e.preventDefault()}>
      <td>{props.summary.type}</td>
      <td>{props.summary.val1}</td>
      <td>{props.summary.val2}</td>
      <td>{props.summary.val3}</td>
      <td>{props.summary.val4}</td>
      <td>{props.summary.val5}</td>
      <td>{props.summary.val6}</td>
      <td>{props.summary.total}</td>
    </tr>
  );
}
