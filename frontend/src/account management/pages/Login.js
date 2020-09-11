import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../../context/UserContext";
import Axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Login.css";

import logo from "./LOGO_192.png";
import ErrorNotice from "../../shared/components/ErrorNotice";

const Login = () => {
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
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/redirect_dashboard");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

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
