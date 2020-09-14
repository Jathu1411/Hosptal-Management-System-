import React from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const DoubleSearchBar = (props) => {
  return (
    <div>
      <Form.Row>
        <Col>
          <Form.Control
            type="text"
            required
            placeholder={props.text1}
            onChange={props.onSearch1}
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            required
            placeholder={props.text2}
            onChange={props.onSearch2}
          />
        </Col>
      </Form.Row>
    </div>
  );
};

export default DoubleSearchBar;
