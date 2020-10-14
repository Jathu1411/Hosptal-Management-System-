import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Container from "react-bootstrap/Container";

import CdNavbar from "../components/CdNavBar";
import DoubleSearchBar from "../../shared/components/DoubleSearchBar";
import AllWaitingPatientList from "../components/dashboard/AllWaitingPatientList";
import SearchWaitingPatientList from "../components/dashboard/SearchWaitingPatientList";
import ConsultForm from "../components/dashboard/ConsultForm";
import PrescriptionForm from "../components/dashboard/PrescriptionForm";
import ReferForm from "../components/dashboard/ReferenceForm";
import SuccessNotice from "../../shared/components/ErrorNotice";
import LoadingModal from "../../shared/components/LoadingModal";
import Footer from "../../shared/components/Footer";

class CdDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentComponent: "dashboard",
      previousComponent: "dashboard",
      patients: [],
      searchedPatients: [],
      currentPatient: undefined,
      success: undefined,
      currentConsultationId: "",
      loading: false,
    };

    this.onSearchWaitingPatientsNic = this.onSearchWaitingPatientsNic.bind(
      this
    );
    this.onSearchWaitingPatientsName = this.onSearchWaitingPatientsName.bind(
      this
    );
    this.setComponent = this.setComponent.bind(this);
    this.toConsult = this.toConsult.bind(this);
    this.toPrescribe = this.toPrescribe.bind(this);
    this.toAdmit = this.toAdmit.bind(this);
    this.toRefer = this.toRefer.bind(this);
  }

  componentDidMount() {
    //get the local token
    let tokenSession = localStorage.getItem("auth-token");

    //if there no local token create blank local token
    if (tokenSession === null) {
      localStorage.setItem("auth-token", "");
      return false;
    }

    //send the local token to check it is valid
    Axios.post(
      "http://localhost:5000/api/users/tokenIsValid",
      {},
      { headers: { "x-auth-token": tokenSession } }
    )
      .then((res) => {
        //if token is valid set the user data and token in local
        if (res.data.valid) {
          if (
            `${res.data.user.unit} ${res.data.user.post}` ===
            "OPD Consultion Doctor"
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
        console.log(error);
        localStorage.setItem("auth-token", "");
        localStorage.setItem("id", "");
        this.props.history.push("/unauthorized");
      });

    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get("http://localhost:5000/api/opd_consultant/waiting_patients", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ patients: res.data });
        this.setState({ loading: false });
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
      case "consulting":
        this.setState({ currentComponent: "consulting" });
        break;
      case "precribing":
        this.setState({ currentComponent: "precribing" });
        break;
      case "refering":
        this.setState({ currentComponent: "refering" });
        break;
      default:
        this.setState({ currentComponent: "dashboard" });
    }
  }

  //search functions
  onSearchWaitingPatientsName(e) {
    if (e.target.value.trim() !== "") {
      const token = localStorage.getItem("auth-token");
      Axios.get(
        "http://localhost:5000/api/opd_consultant/waiting_patients/name/" +
          e.target.value,
        {
          headers: { "x-auth-token": token },
        }
      )
        .then((res) => {
          this.setState({ searchedPatients: res.data });
        })
        .catch((error) => {
          this.setComponent("dashboard");
          console.log(error);
        });
      this.setComponent("waiting_result");
    } else {
      this.setComponent("dashboard");
    }
  }

  onSearchWaitingPatientsNic(e) {
    if (e.target.value.trim() !== "") {
      const token = localStorage.getItem("auth-token");
      Axios.get(
        "http://localhost:5000/api/opd_consultant/waiting_patients/nic/" +
          e.target.value,
        {
          headers: { "x-auth-token": token },
        }
      )
        .then((res) => {
          this.setState({ searchedPatients: res.data });
        })
        .catch((error) => {
          this.setComponent("dashboard");
          console.log(error);
        });
      this.setComponent("waiting_result");
    } else {
      this.setComponent("dashboard");
    }
  }

  //CRUD functions
  toConsult(id) {
    this.setState({
      currentPatient: this.state.patients.find((patient) => patient._id === id),
    });

    this.setComponent("consulting");
  }

  toPrescribe(conId) {
    this.setState({ currentConsultationId: conId });
    this.setComponent("precribing");
  }

  toAdmit() {
    this.setComponent("dashboard");
  }

  toRefer(conId) {
    this.setState({ currentConsultationId: conId });
    this.setComponent("refering");
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
          <CdNavbar />
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
                  toConsult={this.toConsult}
                />
              ) : (
                <div></div>
              )}
              {this.state.currentComponent === "waiting_result" ? (
                <SearchWaitingPatientList
                  patients={this.state.searchedPatients}
                  setComponent={this.setComponent}
                  toConsult={this.toConsult}
                />
              ) : (
                <div></div>
              )}

              {this.state.currentComponent === "consulting" ? (
                <ConsultForm
                  patient={this.state.currentPatient}
                  setComponent={this.setComponent}
                  toPrescribe={this.toPrescribe}
                  toAdmit={this.toAdmit}
                  toRefer={this.toRefer}
                />
              ) : (
                <div></div>
              )}

              {this.state.currentComponent === "precribing" ? (
                <PrescriptionForm
                  patient={this.state.currentPatient}
                  consultationId={this.state.currentConsultationId}
                  setComponent={this.setComponent}
                />
              ) : (
                <div></div>
              )}

              {this.state.currentComponent === "refering" ? (
                <ReferForm
                  patient={this.state.currentPatient}
                  consultationId={this.state.currentConsultationId}
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

export default withRouter(CdDashboard);
