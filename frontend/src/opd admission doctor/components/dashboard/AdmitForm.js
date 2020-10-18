import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import SuccessNotice from "../../../shared/components/ErrorNotice";
import LoadingModal from "../../../shared/components/LoadingModal";
import ValidationModal from "../../../shared/components/NoticeModal";

import Moment from "moment";

export default class AdmitForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.onSubmitComplete = this.onSubmitComplete.bind(this);
    this.onChangeCivilCondition = this.onChangeCivilCondition.bind(this);
    this.onChangeBirthPlace = this.onChangeBirthPlace.bind(this);
    this.onChangeReligion = this.onChangeReligion.bind(this);
    this.onChangeNationality = this.onChangeNationality.bind(this);
    this.onChangeOccupation = this.onChangeOccupation.bind(this);
    this.onChangeGuardian = this.onChangeGuardian.bind(this);
    this.onChangeIncome = this.onChangeIncome.bind(this);
    this.onChangeCaseNo = this.onChangeCaseNo.bind(this);
    this.onChangeInventory = this.onChangeInventory.bind(this);
    this.onChangeHousePhysician = this.onChangeHousePhysician.bind(this);
    this.onChangeComplaint = this.onChangeComplaint.bind(this);
    this.onChangeComplaintDuration = this.onChangeComplaintDuration.bind(this);
    this.onChangeWard = this.onChangeWard.bind(this);
    this.onChangeModeOfOnset = this.onChangeModeOfOnset.bind(this);
    this.onChangeInitialDietPlan = this.onChangeInitialDietPlan.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);

    this.state = {
      patient: {},
      consultation: {},
      admittedBy: "",
      success: undefined,
      modalShow: false,
      modalMessage: "",
      loading: false,
      civilCondition: "unmarried",
      birthPlace: "",
      religion: "",
      nationality: "",
      occupataion: "",
      guardian: "",
      income: 0.0,
      caseNo: "",
      inventory: "",
      housePhysician: "",
      complaint: "",
      complaintDuration: 0,
      ward: "female",
      modeOfOnset: "",
      initialDietPlan: "",
      notes: "",
      opdConsultant: "",
    };
  }

  componentDidMount() {
    this.setState({
      patient: this.props.patient,
      consultation: this.props.consultation,
    });

    //get opd physician name
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get(
      "http://localhost:5000/api/admission/user/" +
        this.props.consultation.consultant,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ opdConsultant: res.data.name });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //onchange function
  onChangeCivilCondition(e) {
    this.setState({
      civilCondition: e.target.value,
    });
  }

  onChangeBirthPlace(e) {
    this.setState({
      birthPlace: e.target.value,
    });
  }

  onChangeReligion(e) {
    this.setState({
      religion: e.target.value,
    });
  }

  onChangeNationality(e) {
    this.setState({
      nationality: e.target.value,
    });
  }

  onChangeOccupation(e) {
    this.setState({
      occupataion: e.target.value,
    });
  }

  onChangeGuardian(e) {
    this.setState({
      guardian: e.target.value,
    });
  }

  onChangeIncome(e) {
    this.setState({
      income: e.target.value,
    });
  }

  onChangeCaseNo(e) {
    this.setState({
      caseNo: e.target.value,
    });
  }

  onChangeInventory(e) {
    this.setState({
      inventory: e.target.value,
    });
  }

  onChangeHousePhysician(e) {
    this.setState({
      housePhysician: e.target.value,
    });
  }

  onChangeComplaint(e) {
    this.setState({
      complaint: e.target.value,
    });
  }

  onChangeComplaintDuration(e) {
    this.setState({
      complaintDuration: e.target.value,
    });
  }

  onChangeWard(e) {
    this.setState({
      ward: e.target.value,
    });
  }

  onChangeModeOfOnset(e) {
    this.setState({
      modeOfOnset: e.target.value,
    });
  }

  onChangeInitialDietPlan(e) {
    this.setState({
      initialDietPlan: e.target.value,
    });
  }

  onChangeNotes(e) {
    this.setState({
      notes: e.target.value,
    });
  }

  //onsubmit funcitons
  onSubmitComplete(e) {
    e.preventDefault();
    if (this.state.civilCondition.trim() === "") {
      this.setState({
        modalMessage: "Civil condition is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.nationality.trim() === "") {
      this.setState({
        modalMessage: "Nationality is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.religion.trim() === "") {
      this.setState({
        modalMessage: "Religion is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (
      isNaN(this.state.income) ||
      this.state.income === null ||
      this.state.income === undefined
    ) {
      this.setState({
        modalMessage: "Income is mandatory and it should be number",
      });
      this.setState({ modalShow: true });
    } else if (this.state.guardian.trim() === "") {
      this.setState({
        modalMessage: "Name and address of the guardian is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.caseNo.trim() === "") {
      this.setState({
        modalMessage: "Case number is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.ward.trim() === "") {
      this.setState({
        modalMessage: "Ward is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (this.state.complaint.trim() === "") {
      this.setState({
        modalMessage: "Complaint is mandatory",
      });
      this.setState({ modalShow: true });
    } else if (
      isNaN(this.state.complaintDuration) ||
      this.state.complaintDuration === null ||
      this.state.complaintDuration === undefined
    ) {
      this.setState({
        modalMessage: "Complaint duration is mandatory",
      });
      this.setState({ modalShow: true });
    } else {
      const admission = {
        civilCondition: this.state.civilCondition,
        birthPlace: this.state.birthPlace,
        religion: this.state.religion,
        nationality: this.state.nationality,
        occupataion: this.state.occupataion,
        guardian: this.state.guardian,
        income: this.state.income,
        caseNo: this.state.caseNo,
        inventory: this.state.inventory,
        housePhysician: this.state.housePhysician,
        complaint: this.state.complaint,
        complaintDuration: this.state.complaintDuration,
        ward: this.state.ward,
        modeOfOnset: this.state.modeOfOnset,
        initialDietPlan: this.state.initialDietPlan,
        notes: this.state.notes,
        consultation: this.state.consultation._id,
        admittedBy: localStorage.getItem("id"),
      };

      this.setState({ loading: true });
      const token = localStorage.getItem("auth-token");
      Axios.post("http://localhost:5000/api/admission/add", admission, {
        headers: { "x-auth-token": token },
      }).then((res) => {
        this.setState({ loading: false });
        this.setState({
          success: "Patient admitted successfully",
        });
        setTimeout(() => {
          this.setState({
            success: undefined,
          });
          this.props.setComponent("dashboard");
        }, 3000);
      });
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

        <div>
          <Container>
            <div className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <MediaQuery minDeviceWidth={1200}>
                <h1 className="h3">Admitting {this.props.patient.name}</h1>
              </MediaQuery>
              <MediaQuery maxDeviceWidth={1200}>
                <h1 className="h3">
                  Admitting <br />
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
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Patient information</h3>
            </div>
            <div style={{ fontSize: "1.1rem" }}>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Name</b>
                </Col>
                <Col sm={10}>{this.props.patient.name}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>NIC number</b>
                </Col>
                <Col sm={10}>{this.props.patient.nic}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Age</b>
                </Col>
                <Col sm={10}>
                  {Moment().diff(this.props.patient.dob, "years")}
                </Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Date of birth</b>
                </Col>
                <Col sm={10}>
                  {Moment(this.props.patient.dob).format("DD/MM/YYYY")}
                </Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Gender</b>
                </Col>
                <Col sm={10}>{this.props.patient.gender}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Address</b>
                </Col>
                <Col sm={10}>{this.props.patient.address}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>OPD visits</b>
                </Col>
                <Col sm={10}>{this.props.consultation.visTime}</Col>
              </Row>
            </div>
            <hr />
          </Container>

          <Container>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Consultation information</h3>
            </div>
            <div style={{ fontSize: "1.1rem" }}>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Physician</b>
                </Col>
                <Col sm={10}>{this.state.opdConsultant}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Disease</b>
                </Col>
                <Col sm={10}>{this.props.consultation.disease}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Disease state</b>
                </Col>
                <Col sm={10}>{this.props.consultation.diseaseState}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Notes</b>
                </Col>
                <Col sm={10}>{this.props.consultation.notes}</Col>
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

            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Ward admission form</h3>
            </div>

            <Form onSubmit={this.onSubmitComplete}>
              <Form.Group as={Row} controlId="formHorizontal">
                <Form.Label column sm={2}>
                  Civil condition*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="select"
                    value={this.state.civilCondition}
                    placeholder="Patient's civil condition"
                    onChange={this.onChangeCivilCondition}
                  >
                    <option value="unmarried">Unmarried</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Birth place
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.birthPlace}
                    placeholder="Patient's birth place"
                    onChange={this.onChangeBirthPlace}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Nationality*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.nationality}
                    placeholder="Patient's nationality"
                    onChange={this.onChangeNationality}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Religion*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.religion}
                    placeholder="Patient's religion"
                    onChange={this.onChangeReligion}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Occupation
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.occupataion}
                    placeholder="Patient's occupation"
                    onChange={this.onChangeOccupation}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal2">
                <Form.Label column sm={2}>
                  Income
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={this.state.income}
                    placeholder="Patient's salary"
                    onChange={this.onChangeIncome}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Name and address of the guardian*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.guardian}
                    placeholder="Guardian's name and address"
                    onChange={this.onChangeGuardian}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Case number*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.caseNo}
                    placeholder="Admission case number"
                    onChange={this.onChangeCaseNo}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal">
                <Form.Label column sm={2}>
                  Ward*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="select"
                    value={this.state.ward}
                    placeholder="Ward admitted"
                    onChange={this.onChangeWard}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Patient's inventory
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.inventory}
                    placeholder="Items of the patient"
                    onChange={this.onChangeInventory}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  House physician
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.housePhysician}
                    placeholder="Assigned ward doctor"
                    onChange={this.onChangeHousePhysician}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Complaint*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.complaint}
                    placeholder="Patient's complaint"
                    onChange={this.onChangeComplaint}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal2">
                <Form.Label column sm={2}>
                  Duration of complaint (in days)*
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    min="0"
                    value={this.state.complaintDuration}
                    placeholder="Complaint's duration"
                    onChange={this.onChangeComplaintDuration}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Mode of onset and present condition
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.modeOfOnset}
                    placeholder="Patient's mode of onset and present condition"
                    onChange={this.onChangeModeOfOnset}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal3">
                <Form.Label column sm={2}>
                  Notes
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    value={this.state.notes}
                    placeholder="Admission notes"
                    onChange={this.onChangeNotes}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal3">
                <Form.Label column sm={2}>
                  Initial diet plan
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    value={this.state.initialDietPlan}
                    placeholder="Initial diet plan for patient"
                    onChange={this.onChangeInitialDietPlan}
                  />
                </Col>
                <Container style={{ textAlign: "center", paddingTop: "3px" }}>
                  <Form.Text className="text-muted">
                    These informations cannot be changed later, make sure these
                    are correct before proceeding.
                  </Form.Text>
                </Container>
              </Form.Group>

              <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Button type="submit" size="lg" block>
                  Confirm admission
                </Button>
              </div>
            </Form>
          </Container>
          <ValidationModal
            show={this.state.modalShow}
            onHide={() => this.setState({ modalShow: false })}
            title="Attention!"
            message={this.state.modalMessage}
          />
        </div>
      </div>
    );
  }
}
