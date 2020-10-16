import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ProceedWarningModal(props) {
  const toContinue = () => {
    props.tocontinue();
  };

  return (
    <Modal
      {...props}
      size="lg"
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
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button onClick={toContinue}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
