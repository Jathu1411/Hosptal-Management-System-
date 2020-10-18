import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./PatientListItem";

export default class AllPatientList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      consultations: [],
    };

    this.getPatientList = this.getPatientList.bind(this);
    this.toViewPatientDetail = this.toViewPatientDetail.bind(this);
  }

  componentDidMount() {
    this.setState({ patients: this.props.patients });
    this.setState({ patients: this.props.consultations });
  }

  toViewPatientDetail(pid, cid) {
    this.props.toViewPatientDetail(pid, cid);
  }

  getPatientList() {
    return this.props.consultations.map((consultation) => {
      const patient = this.props.patients.find(
        (patient) => patient._id === consultation.patient
      );
      return (
        <ListItem
          key={patient._id + consultation._id}
          patient={patient}
          consultationId={consultation._id}
          link={this.toViewPatientDetail}
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
              <h3 className="h4">All ward admissions</h3>
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
            <h3>There are no admissions in the ward</h3>
          </div>
        )}
      </div>
    );
  }
}
