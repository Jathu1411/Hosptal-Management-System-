import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import IcNavbar from "../components/IcNavBar";
import Footer from "../../shared/components/Footer";
import LoadingModal from "../../shared/components/LoadingModal";

import Moment from "moment";
import PatientSummaryTable from "../components/reports/PatientSummaryTable";
import DrugSummaryTable from "../components/reports/DrugSummaryTable";
import DiseaseSummaryTable from "../components/reports/DiseaseSummaryTable";

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
      printing: false,
    };

    this.setComponent = this.setComponent.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onSubmitViewReport = this.onSubmitViewReport.bind(this);
    this.getMonths = this.getMonths.bind(this);
    this.getYears = this.getYears.bind(this);
    this.calcTotalDrugs = this.calcTotalDrugs.bind(this);
    this.onClickExport = this.onClickExport.bind(this);

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
          month: minMonth,
          year: minYear,
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

  calcTotalDrugs() {
    let total = 0;
    this.state.drugSummary.forEach((drug) => {
      total += drug.quantity;
    });
    return total;
  }

  //crud functions
  onSubmitViewReport(e) {
    e.preventDefault();
    // get min date
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get(
      "http://localhost:5000/api/opd_incharge/patient_summary/" +
        this.state.month +
        "/" +
        this.state.year,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({ patientSummary: res.data });
        const token = localStorage.getItem("auth-token");
        Axios.get(
          "http://localhost:5000/api/opd_incharge/drug_summary/" +
            this.state.month +
            "/" +
            this.state.year,
          {
            headers: { "x-auth-token": token },
          }
        )
          .then((res) => {
            this.setState({ drugSummary: res.data });
            const token = localStorage.getItem("auth-token");
            Axios.get(
              "http://localhost:5000/api/opd_incharge/disease_summary/" +
                this.state.month +
                "/" +
                this.state.year,
              {
                headers: { "x-auth-token": token },
              }
            )
              .then((res) => {
                this.setState({ diseaseSummary: res.data });
                this.setState({ loading: false });
                this.setComponent("report");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onClickExport(e) {
    e.preventDefault();
    this.setState({ printing: true }, () => {
      setTimeout(() => {
        this.setState({
          printing: false,
        });
      }, 1000);
      window.print();
    });
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
            {this.state.printing ? (
              <div style={{ paddingBottom: "10px", textAlign: "center" }}>
                <h1 className="h2">
                  Siddha Ayurvedic base hospital - Puthukudiyiruppu, Batticaloa
                </h1>
              </div>
            ) : (
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
            )}
            <Container>
              {this.state.currentComponent === "report" ? (
                <div>
                  <Container>
                    <div style={{ paddingBottom: "3px" }}>
                      <h3 className="h3">
                        OPD monthly statistic report - {this.state.month}/
                        {this.state.year}{" "}
                      </h3>
                    </div>
                    <hr />
                    <div style={{ paddingBottom: "10px" }}>
                      <h3 className="h4">Overall summary</h3>
                    </div>
                    <div style={{ fontSize: "1.1rem" }}>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Total number of patients</Col>
                        <Col sm={8}>
                          {this.state.patientSummary.totalPatients}
                        </Col>
                      </Row>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Total quantity of drugs issued</Col>
                        <Col sm={8}>{this.calcTotalDrugs()}</Col>
                      </Row>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Total number of diseases</Col>
                        <Col sm={8}>{this.state.diseaseSummary.length}</Col>
                      </Row>
                    </div>
                    <hr />
                    <div style={{ paddingBottom: "10px" }}>
                      <h3 className="h4">Patient summary</h3>{" "}
                    </div>
                    <div style={{ fontSize: "1.1rem", paddingBottom: "20px" }}>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Total number of patients</Col>
                        <Col sm={8}>
                          {this.state.patientSummary.totalPatients}
                        </Col>
                      </Row>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Total number of Female patients</Col>
                        <Col sm={8}>{this.state.patientSummary.numFemales}</Col>
                      </Row>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Total number of male patients</Col>
                        <Col sm={8}>{this.state.patientSummary.numMales}</Col>
                      </Row>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Number of first visit patients</Col>
                        <Col sm={8}>
                          {this.state.patientSummary.numFirstVisit}
                        </Col>
                      </Row>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Number of second visit patients</Col>
                        <Col sm={8}>
                          {this.state.patientSummary.numSecondVisit}
                        </Col>
                      </Row>
                    </div>
                    <PatientSummaryTable
                      summaries={this.state.patientSummary.dateSummary}
                    />
                    <div style={{ paddingBottom: "10px" }}>
                      <h3 className="h4">Drug summary</h3>{" "}
                    </div>
                    <div style={{ fontSize: "1.1rem", paddingBottom: "20px" }}>
                      <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                        <Col sm={4}>Total quantity of drugs issued</Col>
                        <Col sm={8}>{this.calcTotalDrugs()}</Col>
                      </Row>
                    </div>
                    <DrugSummaryTable summaries={this.state.drugSummary} />
                    <div style={{ paddingBottom: "10px" }}>
                      <h3 className="h4">Disease summary</h3>{" "}
                    </div>
                    <DiseaseSummaryTable
                      summaries={this.state.diseaseSummary}
                    />
                    {this.state.printing ? (
                      <div></div>
                    ) : (
                      <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                        <Button size="lg" block onClick={this.onClickExport}>
                          Export report as PDF
                        </Button>
                      </div>
                    )}
                  </Container>
                </div>
              ) : (
                <div></div>
              )}
            </Container>
          </div>
        </div>
        {this.state.printing ? (
          <div>
            <Container>
              <hr />
              <div style={{ paddingBottom: "10px" }}>
                <p className="h6">
                  This is a computer generated document no signature required
                </p>{" "}
              </div>
            </Container>
          </div>
        ) : (
          <Footer />
        )}
      </div>
    );
  }
}

export default withRouter(IcReports);
