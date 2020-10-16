import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./PrescribedDrugItem";

export default class PrescribedDrugsList extends Component {
  constructor(props) {
    super(props);

    this.getDrugList = this.getDrugList.bind(this);
  }

  componentDidMount() {}

  getDrugList() {
    return this.props.drugs.map((drug) => {
      return (
        <ListItem
          key={drug._id}
          drug={drug}
          onAddItem={this.props.onAddItem}
          onRemoveItem={this.props.onRemoveItem}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {this.props.drugs.length !== 0 && (
          <div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Drug Name</th>
                  <th>Quantity</th>
                  <th>unit</th>
                  <th>Issued</th>
                  <th>Not issued</th>
                </tr>
              </thead>
              <tbody>{this.getDrugList()}</tbody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}
