import React, { Component } from "react";
import Axios from "axios";
import MediaQuery from "react-responsive";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import SuccessNotice from "../../../shared/components/ErrorNotice";
import LoadingModal from "../../../shared/components/LoadingModal";
import PrescribedDrugsList from "./PrescribedDrugsList";
import ConfirmationModal from "../../../shared/components/ProceedWarningModal";

import Moment from "moment";

export default class IssueForm extends Component {
  constructor(props) {
    super(props);

    Moment().utcOffset("+05:30");

    this.onSubmitComplete = this.onSubmitComplete.bind(this);
    this.onSubmitIssuedAll = this.onSubmitIssuedAll.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.toContinue = this.toContinue.bind(this);

    this.state = {
      patient: {},
      consultation: {},
      initialDrugList: [],
      currentDrugList: [],
      patientId: "",
      dispenser: "",
      success: undefined,
      modalShow: false,
      modalMessage: "",
      currentComponent: "start",
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({
      patient: this.props.patient,
      consultation: this.props.consultation,
      initialDrugList: this.props.consultation.drugs,
      currentDrugList: this.props.consultation.drugs,
    });
  }

  //onsubmit funcitons
  onSubmitComplete(e) {
    let isAllIssued = true;

    this.state.currentDrugList.forEach((drug) => {
      if (drug.state === "pending") {
        isAllIssued = false;
      }
    });

    if (!isAllIssued) {
      this.setState({ modalShow: true });
    } else {
      this.setState({ loading: true });
      const token = localStorage.getItem("auth-token");
      Axios.post(
        "http://localhost:5000/api/opd_dispenser/issueComplete/" +
          this.state.consultation._id +
          "/" +
          this.state.patient._id +
          "/" +
          localStorage.getItem("id"),
        this.state.currentDrugList,
        {
          headers: { "x-auth-token": token },
        }
      )
        .then((res) => {
          this.setState({ loading: false });
          this.setState({
            success: "Drugs issued successfully",
          });
          setTimeout(() => {
            this.setState({
              success: undefined,
            });
            this.props.setComponent("dashboard");
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  toContinue() {
    this.setState({ modalShow: false });
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.post(
      "http://localhost:5000/api/opd_dispenser/issueIncomplete/" +
        this.state.consultation._id +
        "/" +
        localStorage.getItem("id"),
      this.state.currentDrugList,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({ loading: false });
        this.setState({
          success: "Drugs issued successfully",
        });
        setTimeout(() => {
          this.setState({
            success: undefined,
          });
          this.props.setComponent("dashboard");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onSubmitIssuedAll(e) {
    e.preventDefault();
    const newDrugList = [];
    this.state.currentDrugList.forEach((drug) => {
      const newDrug = drug;
      newDrug.state = "issued";
      newDrugList.push(newDrug);
    });
    this.setState({ currentDrugList: newDrugList });
  }

  onAddItem(id) {
    console.log(id);
    const drug = this.state.currentDrugList.find(
      (currentDrug) => currentDrug._id === id
    );
    const drugIndex = this.state.currentDrugList.findIndex(
      (currentDrug) => currentDrug._id === id
    );
    drug.state = "issued";
    const newDrugList = this.state.currentDrugList;
    newDrugList[drugIndex] = drug;
    this.setState({ currentDrugList: newDrugList });
  }

  onRemoveItem(id) {
    const drug = this.state.currentDrugList.find(
      (currentDrug) => currentDrug._id === id
    );
    const drugIndex = this.state.currentDrugList.findIndex(
      (currentDrug) => currentDrug._id === id
    );
    drug.state = "not_issued";
    const newDrugList = this.state.currentDrugList;
    newDrugList[drugIndex] = drug;
    this.setState({ currentDrugList: newDrugList });
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

        <div>
          <Container>
            <div className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <MediaQuery minDeviceWidth={1200}>
                <h1 className="h3">Issueing to {this.props.patient.name}</h1>
              </MediaQuery>
              <MediaQuery maxDeviceWidth={1200}>
                <h1 className="h3">
                  Issueing to <br />
                  {this.props.patient.name}
                </h1>
              </MediaQuery>

              <div className="btn-toolbar mb-2 mb-md-0">
                <Button
                  onClick={() => {
                    this.props.setComponent("dashboard");
                  }}
                >
                  &lt; Back
                </Button>
              </div>
            </div>
          </Container>

          <Container>
            <div style={{ fontSize: "1.1rem" }}>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Name</b>
                </Col>
                <Col sm={10}>{this.props.patient.name}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>NIC number</b>
                </Col>
                <Col sm={10}>{this.props.patient.nic}</Col>
              </Row>
              <Row style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Col sm={2}>
                  <b>Age</b>
                </Col>
                <Col sm={10}>
                  {Moment().diff(this.props.patient.dob, "years")}
                </Col>
              </Row>
            </div>
            <hr />
          </Container>

          <Container>
            {this.state.success !== "" && this.state.success !== undefined && (
              <div style={{ paddingBottom: "5px" }}>
                <SuccessNotice
                  variant="success"
                  msg={this.state.success}
                  clearError={() => this.setState({ success: "" })}
                />
              </div>
            )}

            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Issueing form</h3>
            </div>

            <PrescribedDrugsList
              drugs={this.state.currentDrugList}
              onAddItem={this.onAddItem}
              onRemoveItem={this.onRemoveItem}
            />

            <Row>
              <Col sm={6}>
                <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                  <Button
                    type="submit"
                    size="lg"
                    block
                    onClick={this.onSubmitIssuedAll}
                  >
                    Issued all prescribed drugs
                  </Button>
                </div>
              </Col>
              <Col sm={6}>
                <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                  <Button
                    type="submit"
                    size="lg"
                    block
                    onClick={this.onSubmitComplete}
                  >
                    Complete issueing
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <ConfirmationModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          toContinue={this.toContinue}
          title="Do you want to continue with incomplete issuing?"
          message={
            "You have not completed issuing all drugs. Patient will still be in waiting list. You can finish rest of the issueing later. Do you wish to continue?"
          }
        />
      </div>
    );
  }
}
