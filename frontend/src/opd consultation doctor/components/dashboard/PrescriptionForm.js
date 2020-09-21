import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

//import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import SuccessNotice from "../../../shared/components/ErrorNotice";
import SingleSearchBar from "../../../shared/components/SingleSearchBar";
import SearchedDrugList from "./searchedDrugList";

import Moment from "moment";
import PrescribedList from "./PrescribedList";

export default class PrescriptionForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    //this.onChangeDisease = this.onChangeDisease.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.onSearchDrug = this.onSearchDrug.bind(this);
    this.toAddDrug = this.toAddDrug.bind(this);
    this.toRemoveDrug = this.toRemoveDrug.bind(this);
    this.onSubmitPrescribe = this.onSubmitPrescribe.bind(this);

    this.state = {
      patient: {},
      consultation: {},
      prescription: [],
      drugs: [],
      searchedDrugs: [],
      currentComponent: "",
    };
  }

  componentDidMount() {
    //get patient info from server
    const token = window.sessionStorage.getItem("auth-token");
    Axios.get(
      "http://localhost:5000/api/opd_consultant/" + this.props.patient._id,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({ patient: res.data });
        Axios.get(
          "http://localhost:5000/api/opd_consultant/consultation/" +
            this.props.consultationId,
          {
            headers: { "x-auth-token": token },
          }
        )
          .then((res) => {
            this.setState({ consultation: res.data });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    Axios.get("http://localhost:5000/api/opd_consultant/prescribe/drugs", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ drugs: res.data });
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
      case "drug_result":
        this.setState({ currentComponent: "drug_result" });
        break;
      default:
        this.setState({ currentComponent: "dashboard" });
    }
  }

  //onsubmit funcitons
  onSubmitPrescribe() {
    const prescription = this.state.prescription;
    const token = window.sessionStorage.getItem("auth-token");
    Axios.post(
      "http://localhost:5000/api/opd_consultant/prescribe/" +
        this.state.consultation._id,
      prescription,
      {
        headers: { "x-auth-token": token },
      }
    ).then((res) => {
      this.setState({
        success: "Prescription added successfully",
      });
      setTimeout(() => {
        this.setState({
          success: undefined,
        });
        this.props.setComponent("dashboard");
      }, 2000);
    });
  }

  //search functions
  onSearchDrug(e) {
    if (e.target.value.trim() !== "") {
      const token = window.sessionStorage.getItem("auth-token");
      Axios.get(
        "http://localhost:5000/api/opd_consultant/prescribe/drugs/" +
          e.target.value,
        {
          headers: { "x-auth-token": token },
        }
      )
        .then((res) => {
          this.setState({ searchedDrugs: res.data });
          this.setComponent("drug_result");
        })
        .catch((error) => {
          this.setComponent("start");
          console.log(error);
        });
    } else {
      this.setComponent("start");
    }
  }

  toAddDrug(drug, amount) {
    const newDrug = {
      drugName: drug.drugName,
      quantity: amount,
      unit: drug.unit,
      key: Date.now(),
    };

    const newPrescription = [...this.state.prescription, newDrug];

    this.setState({ prescription: newPrescription });
  }

  toRemoveDrug(key) {
    const newPrescription = this.state.prescription.filter(
      (drug) => drug.key !== key
    );
    this.setState({ prescription: newPrescription });
  }

  render() {
    return (
      <div>
        <Container>
          <div className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <MediaQuery minDeviceWidth={1200}>
              <h1 className="h3">Prescribing {this.props.patient.name}</h1>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1200}>
              <h1 className="h3">
                Prescribing <br />
                {this.props.patient.name}
              </h1>
            </MediaQuery>
          </div>
        </Container>

        <Container>
          <div style={{ fontSize: "1.1rem" }}>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>Name</Col>
              <Col sm={10}>{this.state.patient.name}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>NIC number</Col>
              <Col sm={10}>{this.state.patient.nic}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>Age</Col>
              <Col sm={10}>
                {Moment().diff(this.state.patient.dob, "years")}
              </Col>
            </Row>

            <hr />
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h5">Consultation information</h3>
            </div>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>Disease</Col>
              <Col sm={10}>{this.state.consultation.disease}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>Disease state</Col>
              <Col sm={10}>{this.state.consultation.diseaseState}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>notes</Col>
              <Col sm={10}>{this.state.consultation.notes}</Col>
            </Row>
          </div>
          <hr />
        </Container>
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

          <div style={{ paddingBottom: "5px" }}>
            <h3 className="h5">Prescription information</h3>
          </div>

          {this.state.prescription.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: "0px",
                paddingBottom: "5px",
              }}
            >
              <h3 className="h6">No drugs prescribed yet</h3>
            </div>
          ) : (
            <PrescribedList
              drugs={this.state.prescription}
              toRemoveDrug={this.toRemoveDrug}
            />
          )}

          <hr />

          <div>
            <SingleSearchBar
              onSearch={this.onSearchDrug}
              text="Search drugs by name"
            />
          </div>

          {this.state.currentComponent === "drug_result" ? (
            <SearchedDrugList
              drugs={this.state.searchedDrugs}
              toAddDrug={this.toAddDrug}
            />
          ) : (
            <div></div>
          )}

          <Button onClick={this.onSubmitPrescribe} pe="submit" size="lg" block>
            Complete prescribing
          </Button>
        </Container>
      </div>
    );
  }
}
