import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Button from "react-bootstrap/Button";

class NotAuthorized extends Component {
  render() {
    return (
      <div style={{ height: "100vh" }}>
        <div className="login-container">
          <div className="text-center" style={{ height: "100%" }}>
            <div className="align-vertical">
              <h1
                className="h3 font-weight-normal"
                style={{ color: "#ed1b2e" }}
              >
                Unauthorized access!
              </h1>
              <h2
                className="h5 mb-3 font-weight-normal"
                style={{ paddingBottom: "10px" }}
              >
                You are not authorized to view this page
              </h2>
              <Button
                variant="btn btn-lg btn-primary btn-block"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push("/");
                }}
              >
                Go back to the dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NotAuthorized);
