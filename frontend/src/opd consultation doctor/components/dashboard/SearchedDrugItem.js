import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import ValidationModal from "../../../shared/components/NoticeModal";

export default function SearchedDrugItem(props) {
  const [amount, setamount] = useState(0);
  const [modalShow, setmodalShow] = useState(false);

  const handleSubmit = (e) => {
    if (e.keyCode === 13) {
      if (amount > props.drug.availQuantity) {
        setmodalShow(true);
      } else {
        e.preventDefault();
        props.link(props.drug, amount);
      }
    }
  };

  return (
    <tr>
      <td>{props.drug.drugName}</td>
      <td>{props.drug.drugType}</td>
      <td>{props.drug.availQuantity}</td>
      <td>{props.drug.unit}</td>
      <td>
        <Form.Control
          type="number"
          min="1"
          max={props.drug.availQuantity}
          placeholder={"quantity in " + props.drug.unit}
          name="amount"
          value={amount}
          onChange={(e) => {
            setamount(e.target.value);
          }}
          onKeyDown={handleSubmit}
        />
      </td>
      <ValidationModal
        show={modalShow}
        onHide={() => setmodalShow(false)}
        title="Amount not available in the store"
        message="Prescribing amount cannot exceed available amount"
      />
    </tr>
  );
}
