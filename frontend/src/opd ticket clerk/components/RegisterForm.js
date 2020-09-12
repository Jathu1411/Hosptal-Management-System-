import React, { Component } from "react";

//import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Moment from "moment";

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);

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
    };
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

    console.log(patient);

    //window.location = "/opd_tc_dashboard";
  }

  render() {
    return (
      <div>
        {console.log(this.state.name)}
        <div style={{ paddingBottom: "10px" }}>
          <h3 className="h4">Register Patient</h3>
        </div>
        <Form onSubmit={this.onSubmit}>
          <Form.Group as={Row} controlId="formHorizontal">
            <Form.Label column sm={2}>
              Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
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
                placeholder="Patient's contact number"
                onChange={this.onChangePhone}
              />
            </Col>
          </Form.Group>
          <Button type="submit">Register patient</Button>
        </Form>
      </div>
    );
  }
}
