import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";
import Moment from "moment";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import LoadingModal from "../../../shared/components/LoadingModal";
export default class PatientDetails extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.state = {
      patient: {},
      consultation: {},
      admission: {},
      opdConsultant: "",
      admittedBy: "",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get(
      "http://localhost:5000/api/admission/patients/" + this.props.patientId,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({
          patient: res.data,
        });
        Axios.get(
          "http://localhost:5000/api/admission/consultation/" +
            this.props.consultationId,
          {
            headers: { "x-auth-token": token },
          }
        )
          .then((res) => {
            this.setState({ consultation: res.data });
            Axios.get(
              "http://localhost:5000/api/admission/admission/" +
                this.props.consultationId,
              {
                headers: { "x-auth-token": token },
              }
            )
              .then((res) => {
                this.setState({ admission: res.data });
                //get opd physician name
                const token = localStorage.getItem("auth-token");
                Axios.get(
                  "http://localhost:5000/api/admission/user/" +
                    this.state.consultation.consultant,
                  {
                    headers: { "x-auth-token": token },
                  }
                )
                  .then((res) => {
                    this.setState({ opdConsultant: res.data.name });
                    //get admission doctor's name
                    const token = localStorage.getItem("auth-token");
                    Axios.get(
                      "http://localhost:5000/api/admission/user/" +
                        this.state.admission.admittedBy,
                      {
                        headers: { "x-auth-token": token },
                      }
                    )
                      .then((res) => {
                        this.setState({ admittedBy: res.data.name });
                        this.setState({ loading: false });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
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
        <div>
          <MediaQuery minDeviceWidth={1200}>
            <Container>
              <div className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h3">
                  Ward admission details of {this.state.patient.name}
                </h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.setComponent("start");
                    }}
                  >
                    &lt; Back
                  </Button>
                </div>
              </div>
            </Container>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={1200}>
            <Container>
              <div className="align-items-center pt-3 pb-2 mb-3 border-bottom">
                <div style={{ display: "block" }}>
                  <h1 className="h3">
                    Ward admission details of {this.state.patient.name}
                  </h1>
                </div>
                <div
                  className="btn-toolbar mb-2 mb-md-0"
                  style={{
                    display: "block",
                    overflow: "auto",
                    paddingTop: "1%",
                  }}
                >
                  <Button
                    className="mr-0"
                    style={{
                      float: "right",
                      width: "30%",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.setComponent("start");
                    }}
                  >
                    &lt; Back
                  </Button>
                </div>
              </div>
            </Container>
          </MediaQuery>
          <Container>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Patient's information</h3>
            </div>
            <div style={{ fontSize: "1.1rem" }}>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Name</b>
                </Col>
                <Col sm={10}>{this.state.patient.name}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>NIC number</b>
                </Col>
                <Col sm={10}>{this.state.patient.nic}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Date of birth</b>
                </Col>
                <Col sm={10}>
                  {Moment(this.state.patient.dob).format("DD/MM/YYYY")}
                </Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Age</b>
                </Col>
                <Col sm={10}>
                  {Moment().diff(this.state.patient.dob, "years")}
                </Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Gender</b>
                </Col>
                <Col sm={10}>{this.state.patient.gender}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Address</b>
                </Col>
                <Col sm={10}>{this.state.patient.address}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Phone</b>
                </Col>
                <Col sm={10}>{this.state.patient.phone}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>OPD visit</b>
                </Col>
                <Col sm={10}>{this.state.consultation.visTime}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Civil condition</b>
                </Col>
                <Col sm={10}>{this.state.admission.civilCondition}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Birth place</b>
                </Col>
                <Col sm={10}>{this.state.admission.birthPlace}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Religion</b>
                </Col>
                <Col sm={10}>{this.state.admission.religion}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Nationality</b>
                </Col>
                <Col sm={10}>{this.state.admission.nationality}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Occupation</b>
                </Col>
                <Col sm={10}>{this.state.admission.occupataion}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Name and address of the guardian</b>
                </Col>
                <Col sm={10}>{this.state.admission.guardian}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Income</b>
                </Col>
                <Col sm={10}>{this.state.admission.income}</Col>
              </Row>
              <hr />
              <div style={{ paddingBottom: "10px" }}>
                <h3 className="h4">OPD consultation information</h3>
              </div>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Physician</b>
                </Col>
                <Col sm={10}>{this.state.opdConsultant}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Disease or illness</b>
                </Col>
                <Col sm={10}>{this.state.consultation.disease}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Disease state</b>
                </Col>
                <Col sm={10}>{this.state.consultation.diseaseState}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Notes</b>
                </Col>
                <Col sm={10}>{this.state.consultation.notes}</Col>
              </Row>
              <hr />
              <div style={{ paddingBottom: "10px" }}>
                <h3 className="h4">Ward admission information</h3>
              </div>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Case number</b>
                </Col>
                <Col sm={10}>{this.state.admission.caseNo}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Ward</b>
                </Col>
                <Col sm={10}>{this.state.admission.ward}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Patient's inventory</b>
                </Col>
                <Col sm={10}>{this.state.admission.inventory}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Complaint</b>
                </Col>
                <Col sm={10}>{this.state.admission.complaint}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Duration of the complaint</b>
                </Col>
                <Col sm={10}>{this.state.admission.complaintDuration}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Mode of onset and present condition</b>
                </Col>
                <Col sm={10}>{this.state.admission.modeOfOnset}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>State</b>
                </Col>
                <Col sm={10}>{this.state.admission.state}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>House physician</b>
                </Col>
                <Col sm={10}>{this.state.admission.housePhysician}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Medical officer's notes</b>
                </Col>
                <Col sm={10}>{this.state.admission.notes}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Initial diet plan</b>
                </Col>
                <Col sm={10}>{this.state.admission.initialDietPlan}</Col>
              </Row>
              <Row style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Col sm={2}>
                  <b>Admitted by</b>
                </Col>
                <Col sm={10}>{this.state.admittedBy}</Col>
              </Row>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}
