import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const SingleSearchBar = (props) => {
  return (
    <div>
      <Form.Group as={Row} controlId="formHorizontal">
        <Col sm={12}>
          <Form.Control
            type="search"
            autoComplete="off"
            required
            placeholder={props.text}
            onChange={props.onSearch}
          />
        </Col>
      </Form.Group>
    </div>
  );
};

export default SingleSearchBar;
