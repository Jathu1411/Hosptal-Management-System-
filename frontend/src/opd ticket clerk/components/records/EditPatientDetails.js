import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

import SuccessNotice from "../../../shared/components/ErrorNotice";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import ValidationModal from "../../../shared/components/NoticeModal";
import LoadingModal from "../../../shared/components/LoadingModal";

import Moment from "moment";

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDob = this.onChangeDob.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: "",
      nic: "",
      dob: new Date(),
      gender: "",
      address: "",
      phone: "",
      success: undefined,
      modalShow: false,
      modalMessage: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    let patient = undefined;
    Axios.get("http://localhost:5000/api/opd_tc/" + this.props.patient._id, {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        patient = res.data;
        this.setState({ loading: false });
        this.setState({
          name: patient.name,
          nic: patient.nic,
          dob: patient.dob,
          gender: patient.gender,
          address: patient.address,
          phone: patient.phone,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeDob(e) {
    this.setState({
      dob: Moment(e.target.value).toDate(),
    });
  }

  onChangeGender(e) {
    this.setState({
      gender: e.target.value,
    });
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value,
    });
  }

  onChangePhone(e) {
    this.setState({
      phone: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.name.trim() === "") {
      this.setState({
        modalMessage: "Patient name field is required",
      });
      this.setState({ modalShow: true });
    } else if (this.state.nic.trim() === "") {
      this.setState({
        modalMessage: "Patient NIC number field is required",
      });
      this.setState({ modalShow: true });
    } else if (this.state.nic.trim().length < 10) {
      this.setState({
        modalMessage: "Patient NIC number field must contain 10 characters",
      });
      this.setState({ modalShow: true });
    } else if (this.state.nic.trim().length > 10) {
      this.setState({
        modalMessage:
          "Patient NIC number field must contain 10 characters, try removing spaces.",
      });
      this.setState({ modalShow: true });
    } else if (this.state.gender.trim() === "") {
      this.setState({
        modalMessage: "Patient gender field is required",
      });
      this.setState({ modalShow: true });
    } else if (this.state.address.trim() === "") {
      this.setState({
        modalMessage: "Patient address field is required",
      });
      this.setState({ modalShow: true });
    } else if (this.state.phone.trim().length > 10) {
      this.setState({
        modalMessage:
          "Patient phone number field must contain 10 characters, try removing country code.",
      });
      this.setState({ modalShow: true });
    } else if (this.state.phone.trim().length < 10) {
      this.setState({
        modalMessage: "Patient phone number field must contain 10 characters",
      });
      this.setState({ modalShow: true });
    } else {
      const patient = {
        name: this.state.name,
        nic: this.state.nic,
        dob: this.state.dob,
        gender: this.state.gender,
        address: this.state.address,
        phone: this.state.phone,
      };

      const token = localStorage.getItem("auth-token");
      Axios.post(
        "http://localhost:5000/api/opd_tc/update/" + this.props.patient._id,
        patient,
        {
          headers: { "x-auth-token": token },
        }
      ).then((res) => {
        if (res.data === "success") {
          this.setState({
            success: "Patient updated successfully",
          });

          this.props.editFinish(this.props.patient._id);

          setTimeout(() => {
            this.setState({
              success: undefined,
            });
          }, 5000);
        }
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
        <Container>
          <div className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <MediaQuery minDeviceWidth={1200}>
              <h1 className="h3">
                Edit Patient Details {this.props.patient.name}
              </h1>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1200}>
              <h1 className="h3">
                Edit Patient Details <br />
                {this.props.patient.name}
              </h1>
            </MediaQuery>
            <div className="btn-toolbar mb-2 mb-md-0">
              <Button
                onClick={() => {
                  this.props.setComponent("patient_details");
                }}
              >
                &lt; Back
              </Button>
            </div>
          </div>
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
          <Form onSubmit={this.onSubmit}>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                Name*
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={this.state.name}
                  placeholder="Patient's name"
                  onChange={this.onChangeName}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                NIC number*
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  disabled
                  value={this.state.nic}
                  placeholder="Patient's NIC number"
                  onChange={this.onChangeNic}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                Date of birth*
              </Form.Label>
              <Col sm={10}>
                <input
                  className="form-control"
                  type="date"
                  value={Moment(this.state.dob).format("YYYY-MM-DD")}
                  onChange={this.onChangeDob}
                  id="example-date-input"
                />
              </Col>
            </Form.Group>
            <fieldset>
              <Form.Group as={Row} controlId="formHorizontal">
                <Form.Label column sm={2}>
                  Gender*
                </Form.Label>
                <Col sm={10}>
                  <div key="inline-radio" className="mt-1">
                    <Form.Check
                      inline
                      label="Female"
                      type="radio"
                      required
                      name="gender"
                      value="female"
                      checked={this.state.gender === "female"}
                      onChange={this.onChangeGender}
                      id="inline-radio-1"
                    />
                    <Form.Check
                      inline
                      label="Male"
                      type="radio"
                      required
                      name="gender"
                      value="male"
                      checked={this.state.gender === "male"}
                      onChange={this.onChangeGender}
                      id="inline-radio-2"
                    />
                  </div>
                </Col>
              </Form.Group>
            </fieldset>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                Address*
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={this.state.address}
                  placeholder="Patient's address"
                  onChange={this.onChangeAddress}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                Phone*
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={this.state.phone}
                  placeholder="Patient's contact number"
                  onChange={this.onChangePhone}
                />
              </Col>
            </Form.Group>
            <Button type="submit" size="lg" block>
              Update patient details
            </Button>
          </Form>
        </Container>
        <ValidationModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          title="Attention!"
          message={this.state.modalMessage}
        />
      </div>
    );
  }
}
