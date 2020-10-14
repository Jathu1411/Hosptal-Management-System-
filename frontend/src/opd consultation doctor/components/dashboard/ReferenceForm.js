import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

import Moment from "moment";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import SuccessNotice from "../../../shared/components/ErrorNotice";
import LoadingModal from "../../../shared/components/LoadingModal";

export default class ReferenceForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.onSubmitRefer = this.onSubmitRefer.bind(this);
    this.onChangeReason = this.onChangeReason.bind(this);
    this.onChangeTreatment = this.onChangeTreatment.bind(this);

    this.state = {
      patient: {},
      consultation: {},
      reason: "",
      treatment: "",
      loading: false,
    };
  }

  componentDidMount() {
    //get patient info from server
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
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

  //onchange functions
  onChangeReason(e) {
    this.setState({
      reason: e.target.value,
    });
  }

  onChangeTreatment(e) {
    this.setState({
      treatment: e.target.value,
    });
  }

  //onsubmit funcitons
  onSubmitRefer() {
    const newReference = {
      reasons: this.state.reason,
      treatmentsProvided: this.state.treatment,
    };
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.post(
      "http://localhost:5000/api/opd_consultant/add_cref/" +
        this.state.consultation._id,
      newReference,
      {
        headers: { "x-auth-token": token },
      }
    ).then((res) => {
      this.setState({ loading: false });
      this.setState({
        success: "Referenced to clinic successfully",
      });
      setTimeout(() => {
        this.setState({
          success: undefined,
        });
        this.props.setComponent("dashboard");
      }, 2000);
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
                Refering to clinic {this.props.patient.name}
              </h1>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1200}>
              <h1 className="h3">
                Refering to clinic <br />
                {this.props.patient.name}
              </h1>
            </MediaQuery>
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
            <h3 className="h5">Clinic reference information</h3>
          </div>

          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                Reasons for reffering
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="textarea"
                  rows="4"
                  value={this.state.reason}
                  placeholder="Why the patient is referred to the clinic?"
                  onChange={this.onChangeReason}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                Treatments provided
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="textarea"
                  rows="4"
                  value={this.state.treatment}
                  placeholder="Treatments provided to the patient"
                  onChange={this.onChangeTreatment}
                />
              </Col>
              <Container style={{ textAlign: "center", paddingTop: "3px" }}>
                <Form.Text className="text-muted">
                  These informations cannot be changed changed later, make sure
                  these are correct before proceeding.
                </Form.Text>
              </Container>
            </Form.Group>

            <Button onClick={this.onSubmitRefer} type="submit" size="lg" block>
              Complete refering to clinic
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}
