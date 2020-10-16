import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import Container from "react-bootstrap/Container";

import DisNavbar from "../components/DisNavBar";
import Footer from "../../shared/components/Footer";
import SingleSearchBar from "../../shared/components/SingleSearchBar"; //
import SuccessNotice from "../../shared/components/ErrorNotice";
import LoadingModal from "../../shared/components/LoadingModal";
import AllDrugsList from "../components/drugStore/AllDrugsList"; //
import SearchDrugsList from "../components/drugStore/SearchDrugsList"; //
import ViewDrug from "../components/drugStore/ViewDrug"; //

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
    };

    this.onSearchDrugs = this.onSearchDrugs.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toView = this.toView.bind(this);
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
        this.setState({ loading: false });
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
    this.setState({ loading: true });
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
              {this.state.success !== "" && this.state.success !== undefined && (
                <div style={{ paddingBottom: "5px" }}>
                  <SuccessNotice
                    variant="success"
                    msg={this.state.success}
                    clearError={() => this.setState({ success: "" })}
                  />
                </div>
              )}
              {this.state.currentComponent === "dashboard" ? (
                <AllDrugsList
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
