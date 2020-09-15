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

import Moment from "moment";

export default class PrescriptionForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.onChangeDisease = this.onChangeDisease.bind(this);

    this.state = {
      patient: {},
      consultation: {},
      prescripiton: [],
      drugs: [],
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

  //onchange functions
  onChangeDisease(e) {
    this.setState({
      disease: e.target.value,
    });
  }

  //onsubmit funcitons
  onSubmitPrescribe() {
    let visitNumber = 0;
    if (
      this.state.consultations === undefined ||
      this.state.consultations === [] ||
      this.state.consultations === null
    ) {
      visitNumber = 1;
    } else {
      visitNumber = this.state.consultations.length + 1;
    }
    const consultation = {
      visTime: visitNumber,
      diseaseState: this.state.diseaseState,
      disease: this.state.disease,
      notes: this.state.notes,
      patientId: this.state.patient._id,
      consultant: window.sessionStorage.getItem("id"),
    };

    const token = window.sessionStorage.getItem("auth-token");
    Axios.post("http://localhost:5000/api/opd_consultant/add", consultation, {
      headers: { "x-auth-token": token },
    }).then((res) => {
      this.setState({
        success: "Patient consulted successfully",
      });
      setTimeout(() => {
        this.setState({
          success: undefined,
        });
        this.props.toPrescribe(res.data);
      }, 2000);
    });
  }

  //search functions
  onSearchDrug() {}

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

            <div className="btn-toolbar mb-2 mb-md-0">
              <Button
                onClick={() => {
                  this.props.setComponent("consulting");
                }}
              >
                &lt; Back
              </Button>
            </div>
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

          {this.state.prescripiton.length === 0 ? (
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
            <div></div>
          )}

          <hr />

          <div>
            <SingleSearchBar
              onSearch={this.onSearchDrug}
              text="Search drugs by name"
            />
          </div>

          <Button type="submit" size="lg" block>
            Complete prescribing
          </Button>
        </Container>
      </div>
    );
  }
}
