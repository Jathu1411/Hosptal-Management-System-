import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./DiseaseSummaryItem";

export default class DiseaseSummaryTable extends Component {
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
      return <ListItem key={summary.type + summary.total} summary={summary} />;
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
                  <th>Disease</th>
                  <th>&lt;1 Years</th>
                  <th>1-4 Years</th>
                  <th>5-16 Years</th>
                  <th>17-49 Years</th>
                  <th>50-69 Years</th>
                  <th>&gt;70 Years</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{this.getSummaryList()}</tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no diseases for this month</h3>
          </div>
        )}
      </div>
    );
  }
}
