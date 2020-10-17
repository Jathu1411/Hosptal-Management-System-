import React, { Component } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";

export default class pagination extends Component {
  constructor(props) {
    super(props);

    this.getItems = this.getItems.bind(this);
  }

  getItems() {
    let items = [];
    for (let number = 1; number <= this.props.numberOfPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === this.props.currentPageNumber}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            this.props.onChangePageNumber(number);
          }}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  }

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Pagination>{this.getItems()}</Pagination>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
