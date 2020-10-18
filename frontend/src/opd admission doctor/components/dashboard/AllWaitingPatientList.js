import React, { Component } from "react";
import Axios from "axios";

import Table from "react-bootstrap/Table";
import ListItem from "./WaitingPatientListItem";
import LoadingModal from "../../../shared/components/LoadingModal";

export default class AllWaitingPatientList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      consultations: [],
      loading: false,
    };

    this.getPatientList = this.getPatientList.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toAdmit = this.toAdmit.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get("http://localhost:5000/api/admission/waiting_consultations", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ consultations: res.data });
        const waitingPatients = [];
        const requests = res.data.map((consultation) => {
          return Axios.get(
            "http://localhost:5000/api/admission/waiting_patients/" +
              consultation.patient
          ).then((res) => waitingPatients.push(res.data));
        });

        //waiting for all requests to finish
        Promise.all(requests).then(() => {
          this.setState({ loading: false });
          this.setState({ patients: waitingPatients });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setComponent(changeTo) {
    this.props.setComponent(changeTo);
  }

  toAdmit(pid, cid) {
    this.props.toAdmit(pid, cid);
  }

  getPatientList() {
    return this.state.consultations.map((consultation) => {
      const patient = this.state.patients.find(
        (item) => item._id === consultation.patient
      );
      return (
        <ListItem
          key={patient._id + consultation._id}
          patient={patient}
          consultation={consultation}
          link={this.toAdmit}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div>
            <LoadingModal
              show={this.state.loading}
              onHide={() => this.setState({ loading: false })}
            ></LoadingModal>
          </div>
        ) : (
          <div></div>
        )}
        {this.state.patients.length !== 0 ? (
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">All waiting patients</h3>
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
            <h3>There are no patients waiting</h3>
          </div>
        )}
      </div>
    );
  }
}
