import React from "react";

import Button from "react-bootstrap/Button";

export default function PrescribedItem(props) {
  return (
    <tr key={props.drug.key}>
      <td>{props.drug.drugName}</td>
      <td>{props.drug.quantity}</td>
      <td>{props.drug.unit}</td>
      <td>
        <Button
          variant="danger"
          onClick={() => {
            props.link(props.drug.key);
          }}
        >
          X
        </Button>
      </td>
    </tr>
  );
}
