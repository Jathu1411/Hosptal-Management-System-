import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

import Moment from "moment";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import NormalDrugList from "./NormalDrugList";

import LoadingModal from "../../../shared/components/LoadingModal";

export default class VisitDetails extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.state = {
      patient: {},
      consultation: {},
      reference: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    //get patient info from server
    const token = localStorage.getItem("auth-token");
    Axios.get(
      "http://localhost:5000/api/opd_consultant/" + this.props.patientId,
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
            if (this.state.consultation.stage === "clinic_referenced") {
              this.setState({ loading: true });
              Axios.get(
                "http://localhost:5000/api/opd_consultant/crefs/" +
                  this.props.consultationId,
                {
                  headers: { "x-auth-token": token },
                }
              )
                .then((res) => {
                  this.setState({ reference: res.data });
                  console.log(this.state.reference);
                  this.setState({ loading: false });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            this.setState({ loading: false });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
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
        <Container>
          <div className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <MediaQuery minDeviceWidth={1200}>
              <h1 className="h3">
                Visit: {this.state.consultation.visTime}{" "}
                {Moment(this.state.consultation.date).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </h1>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1200}>
              <h1 className="h3">
                Visit: <br />
                {this.state.consultation.visTime}{" "}
                {Moment(this.state.consultation.date).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </h1>
            </MediaQuery>
            <div className="btn-toolbar mb-2 mb-md-0">
              <Button
                onClick={() => {
                  this.props.setComponent("start");
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
              <Col sm={2}>
                <b>Name</b>
              </Col>
              <Col sm={10}>{this.state.patient.name}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>NIC number</b>
              </Col>
              <Col sm={10}>{this.state.patient.nic}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>Age</b>
              </Col>
              <Col sm={10}>
                {Moment().diff(this.state.patient.dob, "years")}
              </Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>Gender</b>
              </Col>
              <Col sm={10}>{this.state.patient.gender}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>Address</b>
              </Col>
              <Col sm={10}>{this.state.patient.address}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>Phone</b>
              </Col>
              <Col sm={10}>{this.state.patient.phone}</Col>
            </Row>

            <hr />
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h5">Consultation information</h3>
            </div>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>Disease</b>
              </Col>
              <Col sm={10}>{this.state.consultation.disease}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>Disease state</b>
              </Col>
              <Col sm={10}>{this.state.consultation.diseaseState}</Col>
            </Row>
            <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              <Col sm={2}>
                <b>notes</b>
              </Col>
              <Col sm={10}>{this.state.consultation.notes}</Col>
            </Row>
          </div>
          <hr />
        </Container>

        <Container>
          {this.state.consultation.stage === "opd_prescribed" ||
          this.state.consultation.stage === "opd_drug_issued" ? (
            <div>
              <div style={{ paddingBottom: "5px" }}>
                <h3 className="h5">Prescription information</h3>
              </div>
              <NormalDrugList drugs={this.state.consultation.drugs} />
            </div>
          ) : (
            <div></div>
          )}

          {this.state.consultation.stage === "clinic_referenced" ? (
            <div>
              <div style={{ paddingBottom: "5px" }}>
                <h3 className="h5">Clinic reference information</h3>
              </div>

              <div style={{ fontSize: "1.1rem" }}>
                <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                  <Col sm={4}>
                    <b>Reasons for refering</b>
                  </Col>
                  <Col sm={8}>{this.state.reference.reasons}</Col>
                </Row>
                <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                  <Col sm={4}>
                    <b>Treatments provided</b>
                  </Col>
                  <Col sm={8}>{this.state.reference.treatmentsProvided}</Col>
                </Row>
              </div>
              <hr />
            </div>
          ) : (
            <div></div>
          )}

          {this.state.consultation.stage === "ward_referenced" ||
          this.state.consultation.stage === "ward_admitted" ||
          this.state.consultation.stage === "ward_discharged" ||
          this.state.consultation.stage === "ward_discharged" ? (
            <div>
              <div style={{ paddingBottom: "5px" }}>
                <h3 className="h5">Ward Admission information</h3>
              </div>
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "0px",
                  paddingBottom: "5px",
                }}
              >
                <h3 className="h6">Patient is referenced to ward</h3>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </Container>
      </div>
    );
  }
}
