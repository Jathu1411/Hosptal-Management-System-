import React from "react";

export default function NormalDrugItem(props) {
  return (
    <tr key={props.drug.key}>
      <td>{props.drug.drugName}</td>
      <td>{props.drug.quantity}</td>
      <td>{props.drug.unit}</td>
    </tr>
  );
}
