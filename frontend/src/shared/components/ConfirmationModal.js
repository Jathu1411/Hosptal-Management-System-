import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ConfirmationModal(props) {
  const toDeletePatient = () => {
    props.todeletepatient(props.patientid);
  };

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={toDeletePatient}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
