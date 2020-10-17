import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import MediaQuery from "react-responsive";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import SuccessNotice from "../../../shared/components/ErrorNotice";
import LoadingModal from "../../../shared/components/LoadingModal";
import ValidationModal from "../../../shared/components/NoticeModal";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import HistoryList from "./HistoryList";

class ViewDrug extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drug: {},
      drugActions: [],
      success: undefined,
      successSecond: undefined,
      loading: false,
      drugName: "",
      drugType: "",
      availQuantity: 0.0,
      unit: "",
      actionType: "add",
      amount: 0.0,
      remarks: "",
      modalShow: false,
      modalShowDelete: false,
      modalMessage: "",
    };

    this.toView = this.toView.bind(this);
    this.onChangeDrugName = this.onChangeDrugName.bind(this);
    this.onChangeDrugType = this.onChangeDrugType.bind(this);
    this.onChangeUnit = this.onChangeUnit.bind(this);
    this.onSubmitUpdate = this.onSubmitUpdate.bind(this);
    this.onChangeActionType = this.onChangeActionType.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeRemarks = this.onChangeRemarks.bind(this);
    this.onSubmitDelete = this.onSubmitDelete.bind(this);
    this.toDeleteDrug = this.toDeleteDrug.bind(this);
    this.onSubmitAddDrugAction = this.onSubmitAddDrugAction.bind(this);
  }

  componentDidMount() {
    //get the drug
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get(
      "http://localhost:5000/api/opd_dispenser/drug/" + this.props.drug._id,
      {
        headers: { "x-auth-token": token },
      }
    )
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ drug: res.data });
        this.setState({
          drugName: res.data.drugName,
          drugType: res.data.drugType,
          availQuantity: res.data.availQuantity,
          unit: res.data.unit,
        });
        const orderedDrugActions = res.data.drugActions;
        orderedDrugActions.sort((a, b) => {
          return new Date(b.dateTime) - new Date(a.dateTime);
        });
        this.setState({ drugActions: orderedDrugActions });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //CRUD functions
  toView(id) {
    this.setState({
      currentDrug: this.state.drugs.find((drug) => drug._id === id),
    });
    this.setComponent("viewing");
  }

  //onchange functions
  onChangeDrugName(e) {
    this.setState({
      drugName: e.target.value,
    });
  }

  onChangeDrugType(e) {
    this.setState({
      drugType: e.target.value,
    });
  }

  onChangeUnit(e) {
    this.setState({
      unit: e.target.value,
    });
  }

  onChangeActionType(e) {
    this.setState({
      actionType: e.target.value,
    });
  }

  onChangeAmount(e) {
    this.setState({
      amount: parseFloat(e.target.value),
    });
  }

  onChangeRemarks(e) {
    this.setState({
      remarks: e.target.value,
    });
  }

  //onsubmit functions
  onSubmitUpdate(e) {
    e.preventDefault();

    if (this.state.drugName.trim() === "") {
      this.setState({
        modalMessage: "Drug name field is required",
      });
      this.setState({ modalShow: true });
    } else {
      let drugExist = false;
      this.props.drugs.forEach((drug) => {
        if (
          drug.drugName.trim().toLowerCase() === this.state.drugName.trim() &&
          drug._id !== this.state.drug._id
        ) {
          drugExist = true;
        }
      });

      if (drugExist) {
        this.setState({
          modalMessage: "Drug with the same name already exists",
        });
        this.setState({ modalShow: true });
      } else if (this.state.drugType.trim() === "") {
        this.setState({
          modalMessage: "Drug type is required",
        });
        this.setState({ modalShow: true });
      } else if (this.state.unit.trim() === "") {
        this.setState({
          modalMessage: "Drug unit is required",
        });
        this.setState({ modalShow: true });
      } else {
        //add drug in the backend
        const token = localStorage.getItem("auth-token");
        const drug = {
          drugName: this.state.drugName,
          drugType: this.state.drugType,
          availQuantity: this.state.availQuantity,
          unit: this.state.unit,
        };
        this.setState({ loading: true });
        Axios.post(
          "http://localhost:5000/api/opd_dispenser/update/" +
            this.state.drug._id,
          drug,
          {
            headers: { "x-auth-token": token },
          }
        ).then((res) => {
          this.setState({ loading: false });
          if (res.data === "success") {
            //get the drug
            this.setState({ loading: true });
            const token = localStorage.getItem("auth-token");
            Axios.get(
              "http://localhost:5000/api/opd_dispenser/drug/" +
                this.props.drug._id,
              {
                headers: { "x-auth-token": token },
              }
            )
              .then((res) => {
                this.setState({ loading: false });
                this.setState({ drugs: res.data });
                this.setState({
                  drugName: res.data.drugName,
                  drugType: res.data.drugType,
                  availQuantity: res.data.availQuantity,
                  unit: res.data.unit,
                });
                const orderedDrugActions = res.data.drugActions;
                orderedDrugActions.sort((a, b) => {
                  return new Date(b.dateTime) - new Date(a.dateTime);
                });
                this.setState({ drugActions: orderedDrugActions });
                this.setState({
                  success: "Drug updated successfully",
                });
                setTimeout(() => {
                  this.setState({
                    success: undefined,
                  });
                }, 2000);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      }
    }
  }

  onSubmitDelete(e) {
    e.preventDefault();
    this.setState({ modalShowDelete: true });
  }

  toDeleteDrug() {
    this.setState({ modalShowDelete: false });
    this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.delete(
      "http://localhost:5000/api/opd_dispenser/delete/" + this.state.drug._id,
      {
        headers: { "x-auth-token": token },
      }
    ).then((res) => {
      this.setState({ loading: false });
      this.setState({
        successSecond: "Drug record deleted successfully",
      });
      setTimeout(() => {
        this.setState({
          success: undefined,
        });
        this.props.setComponent("dashboard");
      }, 2000);
    });
  }

  onSubmitAddDrugAction(e) {
    e.preventDefault();

    if (this.state.actionType.trim() === "") {
      this.setState({
        modalMessage: "Drug action type is required",
      });
      this.setState({ modalShow: true });
    } else if (isNaN(this.state.amount)) {
      this.setState({
        modalMessage: "Amount is required as a number",
      });
      this.setState({ modalShow: true });
    } else if (this.state.amount === 0.0) {
      this.setState({
        modalMessage: "Amount should be larger than 0",
      });
      this.setState({ modalShow: true });
    } else {
      const drugAction = {
        actionType: this.state.actionType,
        amount: this.state.amount,
        remarks: this.state.remarks,
        unit: this.state.unit,
      };
      this.setState({ loading: true });
      const token = localStorage.getItem("auth-token");
      Axios.post(
        "http://localhost:5000/api/opd_dispenser/drug_action/add/" +
          this.props.drug._id,
        drugAction,
        {
          headers: { "x-auth-token": token },
        }
      )
        .then((res) => {
          this.setState({ loading: false });
          if (res.data === "success") {
            //get the drug
            this.setState({ loading: true });
            const token = localStorage.getItem("auth-token");
            Axios.get(
              "http://localhost:5000/api/opd_dispenser/drug/" +
                this.props.drug._id,
              {
                headers: { "x-auth-token": token },
              }
            )
              .then((res) => {
                this.setState({ loading: false });
                this.setState({ drugs: res.data });
                this.setState({
                  drugName: res.data.drugName,
                  drugType: res.data.drugType,
                  availQuantity: res.data.availQuantity,
                  unit: res.data.unit,
                });
                const orderedDrugActions = res.data.drugActions;
                orderedDrugActions.sort((a, b) => {
                  return new Date(b.dateTime) - new Date(a.dateTime);
                });
                this.setState({ drugActions: orderedDrugActions });
                this.setState({
                  successSecond: "Drug action added successfully",
                });
                this.setState({ amount: 0.0, remarks: "" });
                setTimeout(() => {
                  this.setState({
                    successSecond: undefined,
                  });
                }, 2000);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
                <h1 className="h3">Manage drug: {this.state.drug.drugName}</h1>
              </MediaQuery>
              <MediaQuery maxDeviceWidth={1200}>
                <h1 className="h3">
                  Manage drug: <br />
                  {this.state.drug.drugName}
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
              <h3 className="h4">Update drug</h3>
            </div>
            <Form onSubmit={this.onSubmitUpdate}>
              <Form.Group as={Row} controlId="formHorizontal">
                <Form.Label column sm={2}>
                  Drug name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.drugName}
                    placeholder="Drug's name"
                    onChange={this.onChangeDrugName}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal2">
                <Form.Label column sm={2}>
                  Drug type
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.drugType}
                    placeholder="Drug's type"
                    onChange={this.onChangeDrugType}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal4">
                <Form.Label column sm={2}>
                  Unit
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.unit}
                    placeholder="Drugs measurement unit"
                    onChange={this.onChangeUnit}
                  />
                </Col>
              </Form.Group>

              <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Button type="submit" size="lg" block>
                  Update drug
                </Button>
              </div>
            </Form>
            <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
              <Button
                type="submit"
                size="lg"
                block
                variant="danger"
                onClick={this.onSubmitDelete}
              >
                Delete drug
              </Button>
            </div>
            <hr />
          </Container>

          <Container>
            {this.state.successSecond !== "" &&
              this.state.successSecond !== undefined && (
                <div style={{ paddingBottom: "5px" }}>
                  <SuccessNotice
                    variant="success"
                    msg={this.state.successSecond}
                    clearError={() => this.setState({ successSecond: "" })}
                  />
                </div>
              )}
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Add drug action</h3>
            </div>
            <Form onSubmit={this.onSubmitAddDrugAction}>
              <Form.Group as={Row} controlId="formHorizontal">
                <Form.Label column sm={2}>
                  Action type
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="select"
                    value={this.state.actionType}
                    placeholder="Action's type"
                    onChange={this.onChangeActionType}
                  >
                    <option value="add">Add</option>
                    <option value="remove">Remove</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal2">
                <Form.Label column sm={2}>
                  Amount ({this.state.drug.unit})
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={this.state.amount}
                    placeholder="How much"
                    onChange={this.onChangeAmount}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontal3">
                <Form.Label column sm={2}>
                  Remarks
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    as="textarea"
                    rows="4"
                    value={this.state.remarks}
                    placeholder="Description"
                    onChange={this.onChangeRemarks}
                  />
                </Col>
                <Container style={{ textAlign: "center", paddingTop: "3px" }}>
                  <Form.Text className="text-muted">
                    These informations cannot be changed later, make sure these
                    are correct before proceeding.
                  </Form.Text>
                </Container>
              </Form.Group>

              <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Button type="submit" size="lg" block>
                  Add the drug action
                </Button>
              </div>
            </Form>
            <hr />
          </Container>

          <Container>
            <HistoryList actions={this.state.drugActions} />
          </Container>
        </div>
        <ValidationModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          title="Attention!"
          message={this.state.modalMessage}
        />
        <ConfirmationModal
          show={this.state.modalShowDelete}
          onHide={() => this.setState({ modalShowDelete: false })}
          todeletepatient={this.toDeleteDrug}
          patientid={this.state.drug._id}
          title="Are you sure?"
          message={
            "Do you want to delete drug records of " + this.state.drug.drugName
          }
        />
      </div>
    );
  }
}

export default withRouter(ViewDrug);
