import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import SuccessNotice from "../../../shared/components/ErrorNotice";
import ValidationModal from "../../../shared/components/NoticeModal";
import LoadingModal from "../../../shared/components/LoadingModal";
import VisitDetails from "./VisitDetails";

import Moment from "moment";

export default class ConsultForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.onChangeDisease = this.onChangeDisease.bind(this);
    this.onChangeDiseaseState = this.onChangeDiseaseState.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.onSubmitPrescribe = this.onSubmitPrescribe.bind(this);
    this.onSubmitRefClinic = this.onSubmitRefClinic.bind(this);
    this.onSubmitRefWard = this.onSubmitRefWard.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.viewVisit = this.viewVisit.bind(this);
    this.getVisits = this.getVisits.bind(this);

    this.state = {
      patient: {},
      consultations: [],
      visTime: 0,
      diseaseState: "",
      disease: "",
      notes: "",
      patientId: "",
      consultant: "",
      success: undefined,
      modalShow: false,
      modalMessage: "",
      currentComponent: "start",
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
          "http://localhost:5000/api/opd_consultant/consultations/" +
            this.props.patient._id,
          {
            headers: { "x-auth-token": token },
          }
        )
          .then((res) => {
            this.setState({ consultations: res.data });
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

  setComponent(changeTo) {
    switch (changeTo) {
      case "start":
        this.setState({ currentComponent: "start" });
        break;
      case "view_visit":
        this.setState({ currentComponent: "view_visit" });
        break;
      default:
        this.setState({ currentComponent: "start" });
    }
  }

  //onchange functions
  onChangeDisease(e) {
    this.setState({
      disease: e.target.value,
    });
  }

  onChangeDiseaseState(e) {
    this.setState({
      diseaseState: e.target.value,
    });
  }

  onChangeNotes(e) {
    this.setState({
      notes: e.target.value,
    });
  }

  //onsubmit funcitons
  onSubmitPrescribe(e) {
    if (this.state.disease.trim() === "") {
      this.setState({
        modalMessage: "Disease information is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.diseaseState.trim() === "") {
      this.setState({
        modalMessage: "Disease state information is mandatory",
      });
      this.setState({ modalShow: true });
    } else {
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
        consultant: localStorage.getItem("id"),
      };

      this.setState({ loading: true });
      const token = localStorage.getItem("auth-token");
      Axios.post("http://localhost:5000/api/opd_consultant/add", consultation, {
        headers: { "x-auth-token": token },
      }).then((res) => {
        this.setState({ loading: false });
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
  }

  onSubmitRefClinic() {
    if (this.state.disease.trim() === "") {
      this.setState({
        modalMessage: "Disease information is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.diseaseState.trim() === "") {
      this.setState({
        modalMessage: "Disease state information is mandatory",
      });
      this.setState({ modalShow: true });
    } else {
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
        consultant: localStorage.getItem("id"),
      };

      this.setState({ loading: true });
      const token = localStorage.getItem("auth-token");
      Axios.post("http://localhost:5000/api/opd_consultant/add", consultation, {
        headers: { "x-auth-token": token },
      }).then((res) => {
        this.setState({ loading: false });
        this.setState({
          success: "Patient consulted successfully",
        });
        setTimeout(() => {
          this.setState({
            success: undefined,
          });
          this.props.toRefer(res.data);
        }, 2000);
      });
    }
  }

  onSubmitRefWard() {
    if (this.state.disease.trim() === "") {
      this.setState({
        modalMessage: "Disease information is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.diseaseState.trim() === "") {
      this.setState({
        modalMessage: "Disease state information is mandatory",
      });
      this.setState({ modalShow: true });
    } else {
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
        consultant: localStorage.getItem("id"),
      };

      this.setState({ loading: true });
      const token = localStorage.getItem("auth-token");
      Axios.post("http://localhost:5000/api/opd_consultant/add", consultation, {
        headers: { "x-auth-token": token },
      }).then((res) => {
        const token = localStorage.getItem("auth-token");
        Axios.post(
          "http://localhost:5000/api/opd_consultant/ward/" + res.data,
          {},
          {
            headers: { "x-auth-token": token },
          }
        ).then((res) => {
          this.setState({ loading: false });
          this.setState({
            success: "Patient Consulted and Admitted successfully",
          });
          setTimeout(() => {
            this.setState({
              success: undefined,
            });
            this.props.toAdmit();
          }, 2000);
        });
      });
    }
  }

  viewVisit(patientId, consultationId) {
    this.setState({ patientId: patientId, consultationId: consultationId });
    this.setComponent("view_visit");
  }

  //elements return functions
  getVisits() {
    if (this.state.consultations.length !== 0) {
      return this.state.consultations.map((consultation, i) => {
        return (
          <Row
            key={i + 1}
            role="button"
            style={{ paddingTop: "2px", paddingBottom: "2px" }}
            onClick={() =>
              this.viewVisit(this.state.patient._id, consultation._id)
            }
          >
            <Col sm={2}>
              <b>Visit {i + 1}</b>
            </Col>
            <Col sm={10}>
              {Moment(consultation.date).format("DD/MM/YYYY HH:mm")}
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
        {this.state.currentComponent === "view_visit" ? (
          <div>
            <VisitDetails
              patientId={this.state.patientId}
              consultationId={this.state.consultationId}
              setComponent={this.setComponent}
            />
          </div>
        ) : (
          <div>
            <Container>
              <div className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <MediaQuery minDeviceWidth={1200}>
                  <h1 className="h3">Consulting {this.props.patient.name}</h1>
                </MediaQuery>
                <MediaQuery maxDeviceWidth={1200}>
                  <h1 className="h3">
                    Consulting <br />
                    {this.props.patient.name}
                  </h1>
                </MediaQuery>

                <div className="btn-toolbar mb-2 mb-md-0">
                  <Button
                    onClick={() => {
                      this.props.setComponent("dashboard");
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

                <hr />
                <div style={{ paddingBottom: "10px" }}>
                  <h3 className="h4">Previous visits</h3>
                </div>
                {this.getVisits()}
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
              <div style={{ paddingBottom: "10px" }}>
                <h3 className="h4">Consultation form</h3>
              </div>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group as={Row} controlId="formHorizontal">
                  <Form.Label column sm={2}>
                    Disease*
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      value={this.state.disease}
                      placeholder="Patient's illness/disease type"
                      required
                      onChange={this.onChangeDisease}
                    />
                  </Col>
                </Form.Group>
                <fieldset>
                  <Form.Group as={Row} controlId="formHorizontal">
                    <Form.Label column sm={2}>
                      Disease state*
                    </Form.Label>
                    <Col sm={10}>
                      <div key="inline-radio" className="mt-1">
                        <Form.Check
                          inline
                          label="Mild"
                          type="radio"
                          required
                          name="diseaseState"
                          value="mild"
                          checked={this.state.diseaseState === "mild"}
                          onChange={this.onChangeDiseaseState}
                          id="inline-radio-1"
                        />
                        <Form.Check
                          inline
                          label="Severe"
                          type="radio"
                          required
                          name="diseaseState"
                          value="severe"
                          checked={this.state.diseaseState === "severe"}
                          onChange={this.onChangeDiseaseState}
                          id="inline-radio-2"
                        />
                      </div>
                    </Col>
                  </Form.Group>
                </fieldset>
                <Form.Group as={Row} controlId="formHorizontal">
                  <Form.Label column sm={2}>
                    Notes
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      value={this.state.notes}
                      placeholder="Consultation notes"
                      onChange={this.onChangeNotes}
                    />
                  </Col>
                  <Container style={{ textAlign: "center", paddingTop: "3px" }}>
                    <Form.Text className="text-muted">
                      These informations cannot be changed later, make sure
                      these are correct before proceeding.
                    </Form.Text>
                  </Container>
                </Form.Group>

                <Row>
                  <Col sm={4}>
                    <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                      <Button
                        type="submit"
                        size="lg"
                        block
                        onClick={this.onSubmitPrescribe}
                      >
                        Prescribe
                      </Button>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                      <Button
                        type="submit"
                        size="lg"
                        block
                        onClick={this.onSubmitRefClinic}
                      >
                        Reference to clinic
                      </Button>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                      <Button
                        size="lg"
                        block
                        type="submit"
                        onClick={this.onSubmitRefWard}
                      >
                        Reference to ward
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Container>
            <ValidationModal
              show={this.state.modalShow}
              onHide={() => this.setState({ modalShow: false })}
              title="Attention!"
              message={this.state.modalMessage}
            />
          </div>
        )}
      </div>
    );
  }
}
