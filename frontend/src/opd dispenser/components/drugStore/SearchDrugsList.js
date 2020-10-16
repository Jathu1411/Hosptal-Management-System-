import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./DrugListItem";

export default class SearchDrugsList extends Component {
  constructor(props) {
    super(props);

    this.getDrugsList = this.getDrugsList.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toView = this.toView.bind(this);
  }

  componentDidMount() {}

  setComponent(changeTo) {
    this.props.setComponent(changeTo);
  }

  toView(id) {
    this.props.toViewDrug(id);
  }

  getDrugsList() {
    return this.props.drugs.map((drug) => {
      return <ListItem key={drug._id} drug={drug} link={this.toView} />;
    });
  }

  render() {
    return (
      <div>
        {this.props.drugs.length !== 0 ? (
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Search results</h3>
            </div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Drug name</th>
                  <th>Drug type</th>
                  <th>Available quantity</th>
                  <th>unit</th>
                </tr>
              </thead>
              <tbody>{this.getDrugsList()}</tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no matches</h3>
          </div>
        )}
      </div>
    );
  }
}
