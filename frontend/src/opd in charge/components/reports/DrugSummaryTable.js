import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./DrugSummaryItem";

export default class DrugSummaryTable extends Component {
  constructor(props) {
    super(props);

    this.getSummaryList = this.getSummaryList.bind(this);
  }

  componentDidMount() {}

  getSummaryList() {
    const newList = [];
    this.props.summaries.forEach((summary) => {
      if (summary.quantity > 0) {
        newList.push(summary);
      }
    });
    return newList.map((summary) => {
      return (
        <ListItem key={summary.name + summary.quantity} summary={summary} />
      );
    });
  }

  render() {
    return (
      <div>
        {this.props.summaries.length !== 0 ? (
          <div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Drug</th>
                  <th>Quantity issued</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>{this.getSummaryList()}</tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no drug usage for this month</h3>
          </div>
        )}
      </div>
    );
  }
}
