import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./HistoryListItem";
export default class HistoryList extends Component {
  constructor(props) {
    super(props);

    this.geActionList = this.geActionList.bind(this);
  }

  componentDidMount() {}

  geActionList() {
    return this.props.actions.map((action) => {
      return <ListItem key={action._id} action={action} />;
    });
  }

  render() {
    return (
      <div>
        {this.props.actions.length !== 0 ? (
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Drug history</h3>
            </div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Date and time</th>
                  <th>Action type</th>
                  <th>Amount</th>
                  <th>Balance after</th>
                  <th>Unit</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>{this.geActionList()}</tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no drug actions for this drug</h3>
          </div>
        )}
      </div>
    );
  }
}
