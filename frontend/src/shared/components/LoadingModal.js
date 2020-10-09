import React from "react";
import Container from "react-bootstrap/esm/Container";

import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

export default function LoadingModal(props) {
  return (
    <Modal {...props} size="sm" centered>
      <Modal.Body>
        <Container
          style={{
            textAlign: "center",
            paddingTop: "50px",
            paddingBottom: "20px",
          }}
        >
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p style={{ paddingTop: "5px" }}>Loading...</p>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
