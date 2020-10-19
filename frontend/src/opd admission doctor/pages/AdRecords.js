import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Container from "react-bootstrap/Container";

import AdNavbar from "../components/AdNavBar";
import Footer from "../../shared/components/Footer";
import DoubleSearchBar from "../../shared/components/DoubleSearchBar";
import AllPatientList from "../components/records/AllPatientList";
import AllSearchPatientList from "../components/records/AllSearchPatientList";
import PatientDetails from "../components/records/PatientDetails.js";
import SuccessNotice from "../../shared/components/ErrorNotice";
import LoadingModal from "../../shared/components/LoadingModal";

class AdRecords extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentComponent: "start",
      patients: [],
      consultations: [],
      allWardPatients: [],
      searchedPatients: [],
      currentPatient: "",
      currentConsultation: "",
      success: undefined,
      loading: false,
    };

    this.onSearchAllPatientsNic = this.onSearchAllPatientsNic.bind(this);
    this.onSearchAllPatientsName = this.onSearchAllPatientsName.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toViewAdmissionDetailInAllList = this.toViewAdmissionDetailInAllList.bind(
      this
    );
    this.toViewAdmissionDetailInSearch = this.toViewAdmissionDetailInSearch.bind(
      this
    );
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
            "OPD Admission Doctor"
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
    Axios.get("http://localhost:5000/api/admission/admitted_consultations", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ consultations: res.data });
        const patients = [];

        const requests = res.data.map((consultation) => {
          return Axios.get(
            "http://localhost:5000/api/admission/waiting_patients/" +
              consultation.patient
          ).then((res) => patients.push(res.data));
        });

        //waiting for all requests to finish
        Promise.all(requests).then(() => {
          this.setState({ patients: patients });
          const token = localStorage.getItem("auth-token");
          Axios.get(
            "http://localhost:5000/api/admission/admitted_consultations_patients",
            {
              headers: { "x-auth-token": token },
            }
          )
            .then((res) => {
              this.setState({ loading: false });
              this.setState({ allWardPatients: res.data });
            })
            .catch((error) => {
              this.setComponent("start");
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //navigation functions
  setComponent(changeTo) {
    switch (changeTo) {
      case "start":
        this.setState({ currentComponent: "start" });
        break;
      case "search_result":
        this.setState({ currentComponent: "search_result" });
        break;
      case "patient_details":
        this.setState({ currentComponent: "patient_details" });
        break;
      default:
        this.setState({ currentComponent: "start" });
    }
  }

  //search functions
  onSearchAllPatientsName(e) {
    if (e.target.value.trim() !== "") {
      const searchedPatients = [];
      const exp = new RegExp(e.target.value.trim().toLowerCase());
      this.state.allWardPatients.forEach((patient) => {
        if (exp.test(patient.name.toLowerCase())) {
          searchedPatients.push(patient);
        }
      });
      this.setState({ searchedPatients: searchedPatients }, () => {
        this.setComponent("search_result");
      });
    } else {
      this.setComponent("dashboard");
    }
  }

  onSearchAllPatientsNic(e) {
    if (e.target.value.trim() !== "") {
      const searchedPatients = [];
      const exp = new RegExp(e.target.value.trim().toLowerCase());
      this.state.allWardPatients.forEach((patient) => {
        if (exp.test(patient.nic.toLowerCase())) {
          searchedPatients.push(patient);
        }
      });
      this.setState({ searchedPatients: searchedPatients }, () => {
        this.setComponent("search_result");
      });
    } else {
      this.setComponent("dashboard");
    }
  }

  //crud functions
  toViewAdmissionDetailInAllList(pid, cid) {
    this.setState({ currentPatient: pid, currentConsultation: cid }, () => {
      this.setComponent("patient_details");
    });
  }

  toViewAdmissionDetailInSearch(pid, cid) {
    this.setState({ currentPatient: pid, currentConsultation: cid }, () => {
      this.setComponent("patient_details");
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
        <div style={{ minHeight: "calc(100vh - 70px" }}>
          <AdNavbar />
          <div style={{ paddingTop: "60px" }}>
            {this.state.currentComponent === "start" ||
            this.state.currentComponent === "search_result" ? (
              <div>
                <Container className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Patient records</h1>
                </Container>
                <Container>
                  <DoubleSearchBar
                    onSearch1={this.onSearchAllPatientsName}
                    text1="Search by name"
                    onSearch2={this.onSearchAllPatientsNic}
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
              {this.state.currentComponent === "start" ? (
                <AllPatientList
                  patients={this.state.patients}
                  consultations={this.state.consultations}
                  setComponent={this.setComponent}
                  toViewPatientDetail={this.toViewAdmissionDetailInAllList}
                />
              ) : (
                <div></div>
              )}
              {this.state.currentComponent === "search_result" ? (
                <AllSearchPatientList
                  patients={this.state.searchedPatients}
                  setComponent={this.setComponent}
                  toViewPatientDetail={this.toViewAdmissionDetailInSearch}
                />
              ) : (
                <div></div>
              )}

              {this.state.currentComponent === "patient_details" ? (
                <div>
                  <PatientDetails
                    patientId={this.state.currentPatient}
                    consultationId={this.state.currentConsultation}
                    setComponent={this.setComponent}
                  />
                </div>
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

export default withRouter(AdRecords);
