import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

import userContext from "../../context/UserContext";

import logo from "../../account management/pages/LOGO_192.png";

export default function DisNavBar() {
  const history = useHistory();
  const username = window.sessionStorage.getItem("username");

  const { setUserData } = useContext(userContext);

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    window.sessionStorage.setItem("auth-token", "");
    window.sessionStorage.setItem("username", "");
    window.sessionStorage.setItem("id", "");
    window.sessionStorage.setItem("unit", "");
    window.sessionStorage.setItem("post", "");

    history.push("/");
  };

  //add my account linke

  return (
    <div>
      <Navbar
        fixed="top" //sticky="top"
        collapseOnSelect
        expand="lg"
        bg="primary"
        variant="dark"
      >
        <Link to="/opd_dis_dashboard">
          <Image
            src={logo}
            rounded
            width="40px"
            height="40px"
            className="mr-3"
          />
        </Link>
        <Navbar.Brand href="/opd_dis_dashboard">
          Siddha Ayrvedic Base Hospital
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/opd_dis_dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/opd_dis_dashboard/opd_drug_store">
              Drug Store
            </Nav.Link>
            <NavDropdown
              title={username}
              id="collasible-nav-dropdown"
              alignRight
              drop="down"
            >
              <NavDropdown.Item href="#action/3.1">My account</NavDropdown.Item>
              <NavDropdown.Divider />
              <div onClick={logout}>
                <NavDropdown.Item>Log out</NavDropdown.Item>
              </div>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
