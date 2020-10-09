import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import LoadingModal from "../../../shared/components/LoadingModal";

import Moment from "moment";

export default class PatientDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patient: {},
      consultations: [],
      modalShow: false,
      loading: false,
    };

    this.getVisits = this.getVisits.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.toDeletePatient = this.toDeletePatient.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    const token = window.sessionStorage.getItem("auth-token");
    let patient = undefined;
    Axios.get("http://localhost:5000/api/opd_tc/" + this.props.patient._id, {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        patient = res.data;

        this.setState({
          patient: patient,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    Axios.get(
      "http://localhost:5000/api/opd_tc/consultations/" +
        this.props.patient._id,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({ consultations: res.data }, () => {});
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getVisits() {
    if (this.state.consultations.length !== 0) {
      return this.state.consultations.map((consultation, i) => {
        return (
          <Row
            key={i + 1}
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          >
            <Col sm={2}>
              <b>Visit {i + 1}</b>
            </Col>
            <Col sm={10}>
              {Moment(consultation.date).format("DD/MM/YYYY HH:mm")}{" "}
            </Col>
          </Row>
        );
      });
    } else {
      return (
        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          No previous visits
        </div>
      );
    }
  }

  onClickDelete() {
    this.setState({ modalShow: true });
  }

  toDeletePatient(id) {
    this.setState({ modalShow: false });
    this.props.toDeletePatient(id);
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
                Patient details of {this.state.patient.name}
              </h1>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1200}>
              <h1 className="h3">
                Patient details of <br />
                {this.state.patient.name}
              </h1>
            </MediaQuery>
            <div className="btn-toolbar mb-2 mb-md-0">
              <Button onClick={this.props.goToPrevious}>&lt; Back</Button>
            </div>
          </div>
        </Container>

        <Container>
          <div style={{ fontSize: "1.1rem" }}>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Name</b>
              </Col>
              <Col sm={10}>{this.state.patient.name}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>NIC number</b>
              </Col>
              <Col sm={10}>{this.state.patient.nic}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Date of birth</b>
              </Col>
              <Col sm={10}>
                {Moment(this.state.patient.dob).format("DD/MM/YYYY")}
              </Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Gender</b>
              </Col>
              <Col sm={10}>{this.state.patient.gender}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Address</b>
              </Col>
              <Col sm={10}>{this.state.patient.address}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Phone</b>
              </Col>
              <Col sm={10}>{this.state.patient.phone}</Col>
            </Row>
            <hr />
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Previous visits</h3>
            </div>
            {this.getVisits()}
          </div>
          <Row>
            <Col sm={4}>
              <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                {this.props.patient.stage === "registered" && (
                  <Button size="lg" block disabled>
                    In consultation
                  </Button>
                )}
                {this.state.patient.stage === "in_treatment" && (
                  <Button size="lg" block disabled>
                    In treatment
                  </Button>
                )}
                {this.state.patient.stage === "treated" && (
                  <Button
                    size="lg"
                    block
                    onClick={() => {
                      this.props.toConsultation(this.state.patient._id);
                    }}
                  >
                    Add to the consultation
                  </Button>
                )}
              </div>
            </Col>
            <Col sm={4}>
              <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Button
                  size="lg"
                  block
                  onClick={() => {
                    this.props.toEdit(this.state.patient._id);
                  }}
                >
                  Edit patient details
                </Button>
              </div>
            </Col>
            <Col sm={4}>
              <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Button
                  size="lg"
                  block
                  variant="danger"
                  onClick={this.onClickDelete}
                >
                  Delete patient record
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        <ConfirmationModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          todeletepatient={this.toDeletePatient}
          patientid={this.state.patient._id}
          title="Are you sure?"
          message={
            "Do you want to delete patient records of " +
            this.state.patient.name
          }
        />
      </div>
    );
  }
}
