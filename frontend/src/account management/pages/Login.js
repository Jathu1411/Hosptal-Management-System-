import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import ValidationModal from "../../shared/components/NoticeModal";
import LoadingModal from "../../shared/components/LoadingModal";

import "./Login.css";

import logo from "./LOGO_192.png";
class Login extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      modalShow: false,
      modalMessage: "",
      loading: false,
    };
  }

  componentDidMount() {
    //get the local token
    let tokenSession = localStorage.getItem("auth-token");

    //if there no local token create blank local token
    if (tokenSession === null) {
      localStorage.setItem("auth-token", "");
      tokenSession = "";
    }

    const expiration = localStorage.getItem("expiration");

    if (new Date(expiration) > new Date()) {
      //send the local token to check it is valid
      Axios.post(
        "http://localhost:5000/api/users/tokenIsValid",
        {},
        { headers: { "x-auth-token": tokenSession } }
      )
        .then((res) => {
          //if token is valid set the user data and token in local
          if (res.data.valid) {
            localStorage.setItem("username", res.data.user.username);
            localStorage.setItem("id", res.data.user.id);
            this.forwardDashboard(
              `${res.data.user.unit} ${res.data.user.post}`
            );
          } else {
            localStorage.setItem("auth-token", "");
            localStorage.setItem("username", "");
            localStorage.setItem("id", "");
            localStorage.setItem("expiration", "");
          }
        })
        .catch((error) => {
          console.log(error);
          localStorage.setItem("auth-token", "");
          localStorage.setItem("username", "");
          localStorage.setItem("id", "");
          localStorage.setItem("expiration", "");
        });
    } else {
      localStorage.setItem("auth-token", "");
      localStorage.setItem("username", "");
      localStorage.setItem("id", "");
      localStorage.setItem("expiration", "");
    }
  }

  //onchange functions
  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  forwardDashboard(title) {
    switch (title) {
      case "OPD Ticket Clerk":
        this.props.history.push("/opd_tc_dashboard");
        break;
      case "OPD Consultion Doctor":
        this.props.history.push("/opd_cd_dashboard");
        break;
      case "OPD Dispenser":
        this.props.history.push("/opd_dis_dashboard");
        break;
      case "OPD Admission Doctor":
        this.props.history.push("/opd_ad_dashboard");
        break;
      case "OPD OPD In Charge":
        this.props.history.push("/opd_ic_dashboard");
        break;
      default:
        this.props.history.push("/");
    }
  }

  submit(e) {
    e.preventDefault();

    if (this.state.username.trim() === "") {
      this.setState({
        modalMessage: "Please enter the username",
      });
      this.setState({ modalShow: true });
    } else if (this.state.password.trim() === "") {
      this.setState({
        modalMessage: "Please enter the password",
      });
      this.setState({ modalShow: true });
    } else {
      const loginUser = {
        username: this.state.username,
        password: this.state.password,
      };

      this.setState({ loading: true });
      Axios.post("http://localhost:5000/api/users/auth", loginUser)
        .then((res) => {
          localStorage.setItem("auth-token", res.data.token);
          localStorage.setItem("username", res.data.user.username);
          localStorage.setItem("id", res.data.user.id);
          const tokenExpirationDate = new Date(
            new Date().getTime() + 1000 * 60 * 60
          );
          localStorage.setItem("expiration", tokenExpirationDate.toISOString());
          this.forwardDashboard(`${res.data.user.unit} ${res.data.user.post}`);
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
          this.setState({
            modalMessage: "Username and password do not match",
          });
          this.setState({ modalShow: true });
        });
    }
  }

  render() {
    return (
      <div style={{ height: "100vh" }}>
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
        <div className="login-container">
          <div className="text-center" style={{ height: "100%" }}>
            <div className="align-vertical">
              <Form onSubmit={this.submit} className="form-signin">
                <img
                  width={150}
                  height={150}
                  className="mb-4"
                  src={logo}
                  alt="logo"
                />
                <h1 className="h3 font-weight-normal">
                  Siddha Ayurvedic Base Hopital
                </h1>
                <h2 className="h4 mb-3 font-weight-normal">Batticaloa</h2>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label className="sr-only">Email address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    className="form-control"
                    autoFocus
                    onChange={this.onChangeUsername}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label className="sr-only">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    onChange={this.onChangePassword}
                  />
                </Form.Group>
                <Button
                  variant="btn btn-lg btn-primary btn-block"
                  type="submit"
                >
                  Sign in
                </Button>
                <p className="mt-5 mb-3 text-muted">SABH-PK &copy; 2020</p>
              </Form>
            </div>
          </div>
        </div>
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

export default withRouter(Login);
