import React, { Component } from "react";
import Axios from "axios";

import SuccessNotice from "../../../shared/components/ErrorNotice";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Moment from "moment";

import ValidationModal from "../../../shared/components/NoticeModal";
import LoadingModal from "../../../shared/components/LoadingModal";

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeNic = this.onChangeNic.bind(this);
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

  componentDidMount() {}

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeNic(e) {
    this.setState({
      nic: e.target.value,
    });
    if (e.target.value.trim() !== "" && e.target.value.trim().length === 10) {
      //check whether patient already exists
      const token = window.sessionStorage.getItem("auth-token");
      Axios.get(
        "http://localhost:5000/api/opd_tc/patient_exist/" + e.target.value,
        {
          headers: { "x-auth-token": token },
        }
      ).then((res) => {
        if (res.data === true) {
          this.setState({
            modalMessage:
              "Patient with this NIC number already exists, try finding patient in records",
          });
          this.setState({ modalShow: true });
        }
      });
    }
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

    let patientExist = true;
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
      this.setState({ loading: true });
      //check whether patient already exists
      const token = window.sessionStorage.getItem("auth-token");
      Axios.get(
        "http://localhost:5000/api/opd_tc/patient_exist/" + this.state.nic,
        {
          headers: { "x-auth-token": token },
        }
      )
        .then((res) => {
          patientExist = res.data;
          if (patientExist === true) {
            this.setState({ loading: false });
            this.setState({
              modalMessage:
                "Patient with this NIC number already exists, try finding patient in records",
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

            const token = window.sessionStorage.getItem("auth-token");
            Axios.post("http://localhost:5000/api/opd_tc/add", patient, {
              headers: { "x-auth-token": token },
            }).then((res) => {
              this.setState({ loading: false });
              if (res.data === "success") {
                this.setState({
                  success: "Patient registerd successfully",
                });

                this.setState({
                  name: "",
                  nic: "",
                  dob: new Date(),
                  gender: "",
                  address: "",
                  phone: "",
                });

                setTimeout(() => {
                  this.setState({
                    success: undefined,
                  });
                }, 5000);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
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
        <div style={{ paddingBottom: "10px" }}>
          <h3 className="h4">Register Patient</h3>
        </div>
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
              Name
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
              NIC number
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={this.state.nic}
                placeholder="Patient's NIC number"
                onChange={this.onChangeNic}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontal">
            <Form.Label column sm={2}>
              Date of birth
            </Form.Label>
            <Col sm={10}>
              <input
                className="form-control"
                type="date"
                max={Moment(this.state.dob).format("YYYY-MM-DD")}
                value={Moment(this.state.dob).format("YYYY-MM-DD")}
                onChange={this.onChangeDob}
                id="example-date-input"
              />
            </Col>
          </Form.Group>
          <fieldset>
            <Form.Group as={Row} controlId="formHorizontal">
              <Form.Label column sm={2}>
                Gender
              </Form.Label>
              <Col sm={10}>
                <div key="inline-radio" className="mt-1">
                  <Form.Check
                    inline
                    label="Female"
                    type="radio"
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
              Address
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
              Phone
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
            Register patient
          </Button>
        </Form>
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
