import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./PrescribedItem";

export default class PrescribedList extends Component {
  constructor(props) {
    super(props);

    this.getDrugList = this.getDrugList.bind(this);
    this.toRemoveDrug = this.toRemoveDrug.bind(this);
  }

  componentDidMount() {}

  toRemoveDrug(key) {
    this.props.toRemoveDrug(key);
  }

  getDrugList() {
    return this.props.drugs.map((drug) => {
      return <ListItem key={drug.key} drug={drug} link={this.toRemoveDrug} />;
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
                  <th>Remove</th>
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
