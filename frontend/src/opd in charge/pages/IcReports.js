import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import IcNavbar from "../components/IcNavBar";
import Footer from "../../shared/components/Footer";
import LoadingModal from "../../shared/components/LoadingModal";

import Moment from "moment";

class IcReports extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.state = {
      minMonth: 0,
      maxMonth: 0,
      month: 0,
      minYear: 0,
      maxYear: 0,
      year: 0,
      patientSummary: {},
      drugSummary: {},
      diseaseSummary: {},
      currentComponent: "start",
      loading: false,
    };

    this.setComponent = this.setComponent.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onSubmitViewReport = this.onSubmitViewReport.bind(this);
    this.getMonths = this.getMonths.bind(this);
    this.getYears = this.getYears.bind(this);

    // get min date
    const token = localStorage.getItem("auth-token");
    Axios.get("http://localhost:5000/api/opd_incharge/min_date", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        const minMonth = parseInt(Moment(res.data).format("MM"));
        const minYear = parseInt(Moment(res.data).format("YYYY"));
        const maxMonth = parseInt(Moment(new Date()).format("MM"));
        const maxYear = parseInt(Moment(new Date()).format("YYYY"));
        this.setState({
          minMonth: minMonth,
          maxMonth: maxMonth,
          minYear: minYear,
          maxYear: maxYear,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    //get the local token
    let tokenSession = localStorage.getItem("auth-token");

    //if there no local token create blank local token
    if (tokenSession === null) {
      localStorage.setItem("auth-token", "");
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
            `${res.data.user.unit} ${res.data.user.post}` === "OPD In Charge"
          ) {
            localStorage.setItem("id", res.data.user.id);
          } else {
            this.props.history.push("/unauthorized");
          }
        } else {
          localStorage.setItem("auth-token", "");
          localStorage.setItem("id", "");
          this.props.history.push("/unauthorized");
        }
      })
      .catch((error) => {
        console.log(error);
        localStorage.setItem("auth-token", "");
        localStorage.setItem("id", "");
        this.props.history.push("/unauthorized");
      });
  }

  //navigation functions
  setComponent(changeTo) {
    switch (changeTo) {
      case "start":
        this.setState({ currentComponent: "start" });
        break;
      case "report":
        this.setState({ currentComponent: "report" });
        break;
      default:
        this.setState({ currentComponent: "start" });
    }
  }

  //get month options
  getMonths() {
    const months = [];
    for (
      let index = this.state.minMonth;
      index <= this.state.maxMonth;
      index++
    ) {
      months.push(index);
    }
    return months.map((month) => {
      return (
        <option key={month} value={month}>
          {month}
        </option>
      );
    });
  }

  //get month options
  getYears() {
    const years = [];
    for (let index = this.state.minYear; index <= this.state.maxYear; index++) {
      years.push(index);
    }
    return years.map((year) => {
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    });
  }

  //onchange function
  onChangeMonth(e) {
    this.setState({
      month: e.target.value,
    });
  }

  onChangeYear(e) {
    this.setState({
      year: e.target.value,
    });
  }

  //crud functions
  onSubmitViewReport(e) {
    e.preventDefault();
    // get min date
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get("http://localhost:5000/api/opd_incharge/min_date", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
    this.setComponent("report");
  }

  render() {
    return (
      <div>
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
        <div style={{ minHeight: "calc(100vh - 70px)" }}>
          <IcNavbar />
          <div style={{ paddingTop: "60px" }}>
            <div>
              <Container className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">OPD Patient monthly reports</h1>
              </Container>
              <Container>
                <Form onSubmit={this.onSubmitViewReport}>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formVertical">
                      <Form.Label>Month*</Form.Label>
                      <Form.Control
                        as="select"
                        value={this.state.month}
                        placeholder="Month"
                        onChange={this.onChangeMonth}
                      >
                        {this.getMonths()}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formVertical">
                      <Form.Label>Year*</Form.Label>
                      <Form.Control
                        as="select"
                        value={this.state.year}
                        placeholder="Year"
                        onChange={this.onChangeYear}
                      >
                        {this.getYears()}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                    <Button type="submit" size="lg" block>
                      Generate report
                    </Button>
                  </div>
                </Form>
                <hr />
              </Container>
            </div>
            <Container>
              {this.state.currentComponent === "report" ? (
                <div></div>
              ) : (
                <div></div>
              )}
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(IcReports);
