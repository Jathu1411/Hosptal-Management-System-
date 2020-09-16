import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./SearchedDrugItem";

export default class searchedDrugList extends Component {
  constructor(props) {
    super(props);

    this.getDrugList = this.getDrugList.bind(this);
    this.toAddDrug = this.toAddDrug.bind(this);
  }

  componentDidMount() {}

  toAddDrug(drug, amount) {
    this.props.toAddDrug(drug, amount);
  }

  getDrugList() {
    return this.props.drugs.map((drug) => {
      return <ListItem key={drug._id} drug={drug} link={this.toAddDrug} />;
    });
  }

  render() {
    return (
      <div>
        {this.props.drugs.length !== 0 ? (
          <div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Drug Name</th>
                  <th>Drug type</th>
                  <th>Available quantity</th>
                  <th>unit</th>
                  <th>Prescribe amount</th>
                </tr>
              </thead>
              <tbody>{this.getDrugList()}</tbody>
            </Table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
          >
            <h3 className="h6">There are no matches</h3>
          </div>
        )}
      </div>
    );
  }
}
