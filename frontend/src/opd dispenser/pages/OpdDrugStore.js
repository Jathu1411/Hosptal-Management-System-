import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import DisNavbar from "../components/DisNavBar";
import Footer from "../../shared/components/Footer";
import SingleSearchBar from "../../shared/components/SingleSearchBar";
import SuccessNotice from "../../shared/components/ErrorNotice";
import LoadingModal from "../../shared/components/LoadingModal";
import AllDrugsList from "../components/drugStore/AllDrugsList";
import SearchDrugsList from "../components/drugStore/SearchDrugsList";
import ViewDrug from "../components/drugStore/ViewDrug";
import ValidationModal from "../../shared/components/NoticeModal";

class OpdDrugStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentComponent: "dashboard",
      previousComponent: "dashboard",
      drugs: [],
      searchedDrugs: [],
      currentDrug: undefined,
      success: undefined,
      loading: false,
      drugName: "",
      drugType: "",
      availQuantity: 0.0,
      unit: "",
      modalShow: false,
      modalMessage: "",
    };

    this.onSearchDrugs = this.onSearchDrugs.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toView = this.toView.bind(this);
    this.onChangeDrugName = this.onChangeDrugName.bind(this);
    this.onChangeDrugType = this.onChangeDrugType.bind(this);
    this.onChangeAvailQuantity = this.onChangeAvailQuantity.bind(this);
    this.onChangeUnit = this.onChangeUnit.bind(this);
    this.onSubmitAdd = this.onSubmitAdd.bind(this);
  }

  componentDidMount() {
    //get the local token
    let tokenSession = localStorage.getItem("auth-token");

    //if there no local token create blank local token
    if (tokenSession === null) {
      localStorage.setItem("auth-token", "");
      return false;
    }

    this.setState({ loading: true });
    //send the local token to check it is valid
    Axios.post(
      "http://localhost:5000/api/users/tokenIsValid",
      {},
      { headers: { "x-auth-token": tokenSession } }
    )
      .then((res) => {
        //this.setState({ loading: false });
        //if token is valid set the user data and token in local
        if (res.data.valid) {
          if (
            `${res.data.user.unit} ${res.data.user.post}` === "OPD Dispenser"
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
        this.setState({ loading: false });
        console.log(error);
        localStorage.setItem("auth-token", "");
        localStorage.setItem("id", "");
        this.props.history.push("/unauthorized");
      });

    //get all drugs
    //this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get("http://localhost:5000/api/opd_dispenser/all_drugs", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ drugs: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //navigation functions
  setComponent(changeTo) {
    switch (changeTo) {
      case "dashboard":
        this.setState({ currentComponent: "dashboard" });
        break;
      case "drug_result":
        this.setState({ currentComponent: "drug_result" });
        break;
      case "viewing":
        this.setState({ currentComponent: "viewing" });
        break;
      default:
        this.setState({ currentComponent: "dashboard" });
    }

    //get all drugs
    //this.setState({ loading: true });
    const token = localStorage.getItem("auth-token");
    Axios.get("http://localhost:5000/api/opd_dispenser/all_drugs", {
      headers: { "x-auth-token": token },
    })
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ drugs: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //search functions
  onSearchDrugs(e) {
    if (e.target.value.trim() !== "") {
      const searchedDrugs = [];
      const exp = new RegExp(e.target.value.trim());
      this.state.drugs.forEach((drug) => {
        if (exp.test(drug.drugName)) {
          searchedDrugs.push(drug);
        }
      });
      this.setState({ searchedDrugs: searchedDrugs }, () => {
        this.setComponent("drug_result");
      });
    } else {
      this.setComponent("dashboard");
    }
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

  onChangeAvailQuantity(e) {
    this.setState({
      availQuantity: e.target.value,
    });
  }

  onChangeUnit(e) {
    this.setState({
      unit: e.target.value,
    });
  }

  //onsubmit functions
  onSubmitAdd(e) {
    e.preventDefault();

    if (this.state.drugName.trim() === "") {
      this.setState({
        modalMessage: "Drug name field is required",
      });
      this.setState({ modalShow: true });
    } else {
      let drugExist = false;
      this.state.drugs.forEach((drug) => {
        if (drug.drugName.trim().toLowerCase() === this.state.drugName.trim()) {
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
          dispenser: localStorage.getItem("id"),
        };
        this.setState({ loading: true });
        Axios.post("http://localhost:5000/api/opd_dispenser/add", drug, {
          headers: { "x-auth-token": token },
        }).then((res) => {
          this.setState({ loading: false });
          if (res.data === "success") {
            //get all drugs
            this.setState({ loading: true });
            const token = localStorage.getItem("auth-token");
            Axios.get("http://localhost:5000/api/opd_dispenser/all_drugs", {
              headers: { "x-auth-token": token },
            })
              .then((res) => {
                this.setState({ loading: false });
                this.setState({ drugs: res.data });
                this.setState({
                  drugName: "",
                  drugType: "",
                  availQuantity: 0.0,
                  unit: "",
                });
                this.setState({
                  success: "Drug added successfully",
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
        <div style={{ minHeight: "calc(100vh - 70px" }}>
          <DisNavbar />
          <div style={{ paddingTop: "60px" }}>
            {this.state.currentComponent === "dashboard" ||
            this.state.currentComponent === "drug_result" ? (
              <div>
                <Container className="d-flex justify-content-between felx-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">OPD Drug store</h1>
                  <hr />
                </Container>

                <Container>
                  {this.state.success !== "" &&
                    this.state.success !== undefined && (
                      <div style={{ paddingBottom: "5px" }}>
                        <SuccessNotice
                          variant="success"
                          msg={this.state.success}
                          clearError={() => this.setState({ success: "" })}
                        />
                      </div>
                    )}
                  <div style={{ paddingBottom: "10px" }}>
                    <h3 className="h4">Add new drug</h3>
                  </div>
                  <Form onSubmit={this.onSubmitAdd}>
                    <Form.Group as={Row} controlId="formHorizontal">
                      <Form.Label column sm={2}>
                        Drug name*
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
                        Drug type*
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

                    <Form.Group as={Row} controlId="formHorizontal3">
                      <Form.Label column sm={2}>
                        Available quantity*
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="number"
                          min="0"
                          value={this.state.availQuantity}
                          placeholder="How much drug is currently available"
                          onChange={this.onChangeAvailQuantity}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontal4">
                      <Form.Label column sm={2}>
                        Unit*
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
                        Add drug
                      </Button>
                    </div>
                  </Form>
                  <hr />
                  <ValidationModal
                    show={this.state.modalShow}
                    onHide={() => this.setState({ modalShow: false })}
                    title="Attention!"
                    message={this.state.modalMessage}
                  />
                </Container>

                <Container>
                  <SingleSearchBar
                    onSearch={this.onSearchDrugs}
                    text="Search by drug name"
                  />
                  <hr />
                </Container>
              </div>
            ) : (
              <div></div>
            )}
            <Container>
              {this.state.currentComponent === "dashboard" ? (
                <AllDrugsList
                  drugs={this.state.drugs}
                  setComponent={this.setComponent}
                  toViewDrug={this.toView}
                />
              ) : (
                <div></div>
              )}
              {this.state.currentComponent === "drug_result" ? (
                <SearchDrugsList
                  drugs={this.state.searchedDrugs}
                  setComponent={this.setComponent}
                  toViewDrug={this.toView}
                />
              ) : (
                <div></div>
              )}

              {this.state.currentComponent === "viewing" ? (
                <ViewDrug
                  drug={this.state.currentDrug}
                  drugs={this.state.drugs}
                  setComponent={this.setComponent}
                />
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

export default withRouter(OpdDrugStore);
