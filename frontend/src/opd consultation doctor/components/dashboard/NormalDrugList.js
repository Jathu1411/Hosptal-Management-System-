import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./NormalDrugItem";

export default class NormalDrugList extends Component {
  constructor(props) {
    super(props);

    this.getDrugList = this.getDrugList.bind(this);
  }

  componentDidMount() {}

  getDrugList() {
    return this.props.drugs.map((drug) => {
      return <ListItem key={drug.drugName} drug={drug} />;
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
