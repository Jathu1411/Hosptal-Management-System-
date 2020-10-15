import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Container from "react-bootstrap/Container";

import DisNavbar from "../components/DisNavBar";
import Footer from "../../shared/components/Footer";
import DoubleSearchBar from "../../shared/components/DoubleSearchBar";
import SuccessNotice from "../../shared/components/ErrorNotice";
import LoadingModal from "../../shared/components/LoadingModal";
import IssueForm from "../components/dashboard/IssueForm";
import AllWaitingPatientList from "../components/dashboard/AllWaitingPatientList";
import SearchWaitingPatientList from "../components/dashboard/SearchWaitingPatientList";

class DisDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentComponent: "dashboard",
      previousComponent: "dashboard",
      patients: [],
      searchedPatients: [],
      consultations: [],
      currentPatient: undefined,
      currentConsultation: undefined,
      success: undefined,
      loading: false,
    };

    this.onSearchWaitingPatientsNic = this.onSearchWaitingPatientsNic.bind(
      this
    );
    this.onSearchWaitingPatientsName = this.onSearchWaitingPatientsName.bind(
      this
    );
    this.setComponent = this.setComponent.bind(this);
    this.toIssue = this.toIssue.bind(this);
  }

  componentDidMount() {
    //get the local token
    let tokenSession = localStorage.getItem("auth-token");

    //if there no local token create blank local token
    if (tokenSession === null) {
      localStorage.setItem("auth-token", "");
      return false;
    }

    this.setState({ loading: true });
    //send the local token to check it is valid
    Axios.post(
      "http://localhost:5000/api/users/tokenIsValid",
      {},
      { headers: { "x-auth-token": tokenSession } }
    )
      .then((res) => {
        this.setState({ loading: false });
        //if token is valid set the user data and token in local
        if (res.data.valid) {
          if (
            `${res.data.user.unit} ${res.data.user.post}` === "OPD Dispenser"
          ) {
            localStorage.setItem("id", res.data.user.id);
          } else {
            this.props.history.push("/unauthorized");
          }
        } else {
          localStorage.setItem("auth-token", "");
          localStorage.setItem("id", "");
          this.props.history.push("/unauthorized");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
        localStorage.setItem("auth-token", "");
        localStorage.setItem("id", "");
        this.props.history.push("/unauthorized");
      });

    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get("http://localhost:5000/api/opd_dispenser/waiting_consultations", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ consultations: res.data });
        const waitingPatients = [];

        const requests = res.data.map((consultation) => {
          return Axios.get(
            "http://localhost:5000/api/opd_dispenser/waiting_patients/" +
              consultation.patient
          ).then((res) => waitingPatients.push(res.data));
        });

        //waiting for all requests to finish
        Promise.all(requests).then(() => {
          this.setState({ patients: waitingPatients });
          this.setState({ loading: false });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //navigation functions
  setComponent(changeTo) {
    switch (changeTo) {
      case "dashboard":
        this.setState({ currentComponent: "dashboard" });
        break;
      case "waiting_result":
        this.setState({ currentComponent: "waiting_result" });
        break;
      case "issueing":
        this.setState({ currentComponent: "issueing" });
        break;
      default:
        this.setState({ currentComponent: "dashboard" });
    }
  }

  //search functions
  onSearchWaitingPatientsName(e) {
    if (e.target.value.trim() !== "") {
      const searchedPatients = [];
      const exp = new RegExp(e.target.value.trim());
      this.state.patients.forEach((patient) => {
        if (exp.test(patient.name)) {
          searchedPatients.push(patient);
        }
      });
      this.setState({ searchedPatients: searchedPatients }, () => {
        this.setComponent("waiting_result");
      });
    } else {
      this.setComponent("dashboard");
    }
  }

  onSearchWaitingPatientsNic(e) {
    if (e.target.value.trim() !== "") {
      const searchedPatients = [];
      const exp = new RegExp(e.target.value.trim());
      this.state.patients.forEach((patient) => {
        if (exp.test(patient.nic)) {
          searchedPatients.push(patient);
        }
      });
      this.setState({ searchedPatients: searchedPatients });
      this.setComponent("waiting_result");
    } else {
      this.setComponent("dashboard");
    }
  }

  //CRUD functions
  toIssue(pid, cid) {
    this.setState({
      currentPatient: this.state.patients.find(
        (patient) => patient._id === pid
      ),
      currentConsultation: this.state.consultations.find(
        (consultation) => consultation._id === cid
      ),
    });
    this.setComponent("issueing");
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
        <div style={{ minHeight: "calc(100vh - 70px" }}>
          <DisNavbar />
          <div style={{ paddingTop: "60px" }}>
            {this.state.currentComponent === "dashboard" ||
            this.state.currentComponent === "waiting_result" ? (
              <div>
                <Container className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Dashboard</h1>
                </Container>
                <Container>
                  <DoubleSearchBar
                    onSearch1={this.onSearchWaitingPatientsName}
                    text1="Search by name"
                    onSearch2={this.onSearchWaitingPatientsNic}
                    text2="Search by NIC number"
                  />
                  <hr />
                </Container>
              </div>
            ) : (
              <div></div>
            )}
            <Container>
              {this.state.success !== "" && this.state.success !== undefined && (
                <div style={{ paddingBottom: "5px" }}>
                  <SuccessNotice
                    variant="success"
                    msg={this.state.success}
                    clearError={() => this.setState({ success: "" })}
                  />
                </div>
              )}
              {this.state.currentComponent === "dashboard" ? (
                <AllWaitingPatientList
                  setComponent={this.setComponent}
                  toIssue={this.toIssue}
                />
              ) : (
                <div></div>
              )}
              {this.state.currentComponent === "waiting_result" ? (
                <SearchWaitingPatientList
                  patients={this.state.searchedPatients}
                  consultations={this.state.consultations}
                  setComponent={this.setComponent}
                  toIssue={this.toIssue}
                />
              ) : (
                <div></div>
              )}

              {this.state.currentComponent === "issueing" ? (
                <IssueForm
                  patient={this.state.currentPatient}
                  consultation={this.state.currentConsultation}
                  setComponent={this.setComponent}
                />
              ) : (
                <div></div>
              )}
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(DisDashboard);
