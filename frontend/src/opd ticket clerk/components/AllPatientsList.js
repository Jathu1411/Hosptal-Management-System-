import React, { Component } from "react";
//import { Link } from "react-router-dom";

//import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import ListItem from "./PatientListItem";

export default class AllPatientsList extends Component {
  constructor(props) {
    super(props);

    this.getPatientList = this.getPatientList.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toConsultation = this.toConsultation.bind(this);
    this.toEdit = this.toEdit.bind(this);
    this.toViewPatientDetail = this.toViewPatientDetail.bind(this);
    this.toDeletePatient = this.toDeletePatient.bind(this);
  }

  componentDidMount() {}

  //onClick={() => this.props.setComponent("patient_info")}

  setComponent(changeTo) {
    this.props.setComponent(changeTo);
  }

  toViewPatientDetail(id) {
    this.props.toViewPatientDetail(id);
  }
  toConsultation(id) {
    this.props.toConsultation(id);
  }

  toEdit(id) {
    this.props.toEdit(id);
  }

  toDeletePatient(id) {
    this.props.toDeletePatient(id);
  }

  getPatientList() {
    const buttonArr = [
      {
        title: "To consultation",
        onclick: this.toConsultation,
      },
      {
        title: "Edit",
        onclick: this.toEdit,
      },
    ];
    return this.props.patients.map((patient) => {
      return (
        <ListItem
          key={patient._id}
          patient={patient}
          buttons={buttonArr}
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
              <h3 className="h4">All patients</h3>
            </div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Name</th>
                  <th>NIC number</th>
                  <th>Date of birth</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>To consultation</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>{this.getPatientList()}</tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no registered patients</h3>
          </div>
        )}
      </div>
    );
  }
}
