import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./PatientListItem";

export default class AllSearchPatientList extends Component {
  constructor(props) {
    super(props);

    this.getPatientList = this.getPatientList.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toViewPatientDetail = this.toViewPatientDetail.bind(this);
  }

  componentDidMount() {}

  setComponent(changeTo) {
    this.props.setComponent(changeTo);
  }

  toViewPatientDetail(id) {
    this.props.toViewPatientDetail(id);
  }
  getPatientList() {
    return this.props.patients.map((patient) => {
      return (
        <ListItem
          key={patient._id}
          patient={patient}
          link={this.toViewPatientDetail}
          from={"search_result"}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {this.props.patients.length !== 0 ? (
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Search results</h3>
            </div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Name</th>
                  <th>NIC number</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>{this.getPatientList()}</tbody>
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
