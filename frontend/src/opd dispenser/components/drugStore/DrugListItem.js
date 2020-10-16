import React from "react";

export default function DrugListItem(props) {
  return (
    <tr onClick={() => props.link(props.drug._id)}>
      <td>{props.drug.drugName}</td>
      <td>{props.drug.drugType}</td>
      <td>{props.drug.availQuantity}</td>
      <td>{props.drug.unit}</td>
    </tr>
  );
}
