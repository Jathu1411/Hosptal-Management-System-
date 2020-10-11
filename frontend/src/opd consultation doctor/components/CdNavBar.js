import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

import logo from "../../account management/pages/LOGO_192.png";

export default function CdNavBar() {
  const history = useHistory();
  const username = window.sessionStorage.getItem("username");

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 1200px)",
  });

  const isDesktopDevice = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  const logout = () => {
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
        <Link to="/opd_cd_dashboard">
          <Image
            src={logo}
            rounded
            width="40px"
            height="40px"
            className="mr-3"
          />
        </Link>

        {isDesktopDevice && (
          <Navbar.Brand href="/opd_cd_dashboard">
            Siddha Ayrvedic Base Hospital
          </Navbar.Brand>
        )}

        {isMobileDevice &&
          (isPortrait ? (
            <Navbar.Brand href="/opd_cd_dashboard">SABH</Navbar.Brand>
          ) : (
            <Navbar.Brand href="/opd_cd_dashboard">
              Siddha Ayrvedic Base Hospital
            </Navbar.Brand>
          ))}

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link
              href="/opd_cd_dashboard"
              onClick={(e) => {
                e.preventDefault();
                history.push("/opd_cd_dashboard");
              }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="/opd_cd_dashboard/records"
              onClick={(e) => {
                e.preventDefault();
                history.push("/opd_cd_dashboard/records");
              }}
            >
              Records
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
