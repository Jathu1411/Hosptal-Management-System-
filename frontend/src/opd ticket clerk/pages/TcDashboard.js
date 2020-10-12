import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Footer from "../../shared/components/Footer";
import TcNavbar from "../components/TcNavBar";
import RegisterForm from "../components/dashboard/RegisterForm";
import Container from "react-bootstrap/Container";

class TcDashboard extends Component {
  componentDidMount() {
    //get the local token
    let tokenSession = window.sessionStorage.getItem("auth-token");

    //if there no local token create blank local token
    if (tokenSession === null) {
      window.sessionStorage.setItem("auth-token", "");
      return false;
    }

    //send the local token to check it is valid
    Axios.post(
      "http://localhost:5000/api/users/tokenIsValid",
      {},
      { headers: { "x-auth-token": tokenSession } }
    )
      .then((res) => {
        //if token is valid set the user data and token in local
        if (res.data.valid) {
          if (
            `${res.data.user.unit} ${res.data.user.post}` === "OPD Ticket Clerk"
          ) {
            window.sessionStorage.setItem("id", res.data.user.id);
          } else {
            this.props.history.push("/unauthorized");
          }
        } else {
          window.sessionStorage.setItem("auth-token", "");
          window.sessionStorage.setItem("id", "");
          this.props.history.push("/unauthorized");
        }
      })
      .catch((error) => {
        console.log(error);
        window.sessionStorage.setItem("auth-token", "");
        window.sessionStorage.setItem("id", "");
        this.props.history.push("/unauthorized");
      });
  }

  render() {
    return (
      <div>
        <div style={{ minHeight: "calc(100vh - 70px" }}>
          <TcNavbar />
          <div style={{ paddingTop: "60px" }}>
            <Container className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Dashboard</h1>
            </Container>
            <Container>
              <RegisterForm />
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(TcDashboard);
