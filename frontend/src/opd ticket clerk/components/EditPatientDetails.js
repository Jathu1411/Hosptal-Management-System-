import React, { Component } from "react";
import Axios from "axios";

import SuccessNotice from "../../shared/components/ErrorNotice";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import Moment from "moment";

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
    };
  }

  componentDidMount() {
    this.setState({
      name: this.props.patient.name,
      nic: this.props.patient.nic,
      dob: this.props.patient.dob,
      gender: this.props.patient.gender,
      address: this.props.patient.address,
      phone: this.props.patient.phone,
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeNic(e) {
    this.setState({
      nic: e.target.value,
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

    const patient = {
      name: this.state.name,
      nic: this.state.nic,
      dob: this.state.dob,
      gender: this.state.gender,
      address: this.state.address,
      phone: this.state.phone,
    };

    const token = window.sessionStorage.getItem("auth-token");
    Axios.post(
      "http://localhost:5000/api/opd_tc/update/" + this.props.patient._id,
      patient,
      {
        headers: { "x-auth-token": token },
      }
    ).then((res) => {
      //window.sessionStorage.setItem("success", res.data);
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

    //window.location = "/opd_tc_dashboard";
  }

  render() {
    return (
      <div>
        {console.log(this.state)}
        <Container className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h3">Edit Patient Details {this.props.patient.name}</h1>
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
                Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={this.state.name}
                  placeholder="Patient's name"
                  required
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
                  required
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
                Address
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  required
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
                  required
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
      </div>
    );
  }
}
