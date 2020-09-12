import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../../context/UserContext";
import Axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Login.css";

import logo from "./LOGO_192.png";
import ErrorNotice from "../../shared/components/ErrorNotice";

const Login = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(userContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const loginUser = { username, password };
      const loginRes = await Axios.post(
        "http://localhost:5000/api/users/auth",
        loginUser
      );
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      window.sessionStorage.setItem("auth-token", loginRes.data.token);
      window.sessionStorage.setItem("username", loginRes.data.user.username);
      window.sessionStorage.setItem("id", loginRes.data.user.id);
      window.sessionStorage.setItem("unit", loginRes.data.user.unit);
      window.sessionStorage.setItem("post", loginRes.data.user.post);
      window.sessionStorage.setItem("error", undefined);

      switch (`${loginRes.data.user.unit} ${loginRes.data.user.post}`) {
        case "OPD Ticket Clerk":
          history.push("/opd_tc_dashboard");
          break;
        case "OPD Consultion Doctor":
          history.push("/opd_cd_dashboard");
          break;
        case "OPD Dispenser":
          history.push("/opd_dis_dashboard");
          break;
        case "OPD Admission Doctor":
          history.push("/opd_ad_dashboard");
          break;
        case "OPD OPD In Charge":
          history.push("/opd_ic_dashboard");
          break;
        default:
          history.push("/");
      }
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const checkLoginError = () => {
    if (window.sessionStorage.getItem("error") !== undefined) {
      if (window.sessionStorage.getItem("error") === "session") {
        setError("Session expired, please login again");
      }
    }
  };

  useEffect(() => {
    checkLoginError();
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {error && (
        <ErrorNotice
          variant="danger"
          msg={error}
          clearError={() => setError(undefined)}
        />
      )}

      <div className="login-container">
        <div className="text-center" style={{ height: "100%" }}>
          <div className="align-vertical">
            <Form onSubmit={submit} className="form-signin">
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
                  required
                  autoFocus
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label className="sr-only">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="btn btn-lg btn-primary btn-block" type="submit">
                Sign in
              </Button>
              <p className="mt-5 mb-3 text-muted">SABH-PK &copy; 2020</p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
