import React, { Component } from "react";
import Axios from "axios";

//import SuccessNotice from "../../shared/components/ErrorNotice";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ConfirmationModal from "../../shared/components/ConfirmationModal";

import Moment from "moment";

export default class PatientDetails extends Component {
  constructor(props) {
    super(props);

    //this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      patient: {},
      consultations: [],
      modalShow: false,
    };

    this.getVisits = this.getVisits.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.toDeletePatient = this.toDeletePatient.bind(this);
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem("auth-token");
    Axios.get(
      "http://localhost:5000/api/opd_tc/consultations/" +
        this.props.patient._id,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({ consultations: res.data }, () => {
          console.log(res.data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getVisits() {
    console.log(this.state.consultations);
    if (this.state.consultations.length !== 0) {
      return this.state.consultations.map((consultation, i) => {
        return (
          <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
            <Col sm={2}>
              <b>Visit {i + 1}</b>
            </Col>
            <Col sm={10}>
              {Moment(consultation.date).format("DD/MM/YYYY HH:MM")}{" "}
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
    this.props.toDeletePatient(id);
  }

  render() {
    return (
      <div>
        {console.log(this.state)}
        <Container className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h3">Patient details of {this.props.patient.name}</h1>
        </Container>
        {/*this.state.success !== "" && this.state.success !== undefined && (
          <div style={{ paddingBottom: "5px" }}>
            <SuccessNotice
              variant="success"
              msg={this.state.success}
              clearError={() => this.setState({ success: "" })}
            />
          </div>
        )*/}
        <Container>
          <div style={{ fontSize: "1.1rem" }}>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Name</b>
              </Col>
              <Col sm={10}>{this.props.patient.name}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>NIC number</b>
              </Col>
              <Col sm={10}>{this.props.patient.nic}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Date of birth</b>
              </Col>
              <Col sm={10}>
                {Moment(this.props.patient.dob).format("DD/MM/YYYY")}
              </Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Gender</b>
              </Col>
              <Col sm={10}>{this.props.patient.gender}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Address</b>
              </Col>
              <Col sm={10}>{this.props.patient.address}</Col>
            </Row>
            <Row style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <Col sm={2}>
                <b>Phone</b>
              </Col>
              <Col sm={10}>{this.props.patient.phone}</Col>
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
                <Button
                  size="lg"
                  block
                  onClick={() => {
                    this.props.toConsultation(this.props.patient._id);
                  }}
                >
                  Add to the consultation
                </Button>
              </div>
            </Col>
            <Col sm={4}>
              <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Button
                  size="lg"
                  block
                  onClick={() => {
                    this.props.toEdit(this.props.patient._id);
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
          patientid={this.props.patient._id}
          title="Are you sure?"
          message={
            "Do you want to delete patient records of " +
            this.props.patient.name
          }
        />
      </div>
    );
  }
}
