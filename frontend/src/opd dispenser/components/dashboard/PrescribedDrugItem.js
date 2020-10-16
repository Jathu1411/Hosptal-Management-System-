import React from "react";
import Button from "react-bootstrap/Button";

export default function PrescribedDrugItem(props) {
  return (
    <tr key={props.drug.key}>
      <td>{props.drug.drugName}</td>
      <td>{props.drug.quantity}</td>
      <td>{props.drug.unit}</td>
      <td>
        {props.drug.state === "not_issued" || props.drug.state === "pending" ? (
          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              props.onAddItem(props.drug._id);
            }}
          >
            Issued
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled
            onClick={(e) => {
              e.stopPropagation();
              props.onAddItem(props.drug._id);
            }}
          >
            Issued
          </Button>
        )}
      </td>
      <td>
        {props.drug.state === "issued" || props.drug.state === "pending" ? (
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              props.onRemoveItem(props.drug._id);
            }}
          >
            Not issued
          </Button>
        ) : (
          <Button
            variant="danger"
            disabled
            onClick={(e) => {
              e.stopPropagation();
              props.onRemoveItem(props.drug._id);
            }}
          >
            Not issued
          </Button>
        )}
      </td>
    </tr>
  );
}
