import React from "react";

import TcNavbar from "../components/TcNavBar";
import RegisterForm from "../components/RegisterForm";
import Container from "react-bootstrap/Container";

const TcDashboard = () => {
  return (
    <div>
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
  );
};

export default TcDashboard;
