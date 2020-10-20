import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./PatientSummaryItem";

export default class PatientSummaryTable extends Component {
  constructor(props) {
    super(props);

    this.getSummaryList = this.getSummaryList.bind(this);
  }

  componentDidMount() {}

  getSummaryList() {
    const newList = [];
    this.props.summaries.forEach((summary) => {
      if (summary.total > 0) {
        newList.push(summary);
      }
    });
    return newList.map((summary) => {
      return <ListItem key={summary.month + summary.date} summary={summary} />;
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
                  <th>Date</th>
                  <th>Visit 1</th>
                  <th>Visit 2</th>
                  <th>Visit 3</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{this.getSummaryList()}</tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no patients for this month</h3>
          </div>
        )}
      </div>
    );
  }
}
