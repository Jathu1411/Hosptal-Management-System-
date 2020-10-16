import React, { Component } from "react";
import Axios from "axios";

import Table from "react-bootstrap/Table";
import ListItem from "./DrugListItem";
import LoadingModal from "../../../shared/components/LoadingModal";

export default class AllDrugsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drugs: [],
      loading: false,
    };

    this.getDrugsList = this.getDrugsList.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.toView = this.toView.bind(this);
  }

  componentDidMount() {
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

  setComponent(changeTo) {
    this.props.setComponent(changeTo);
  }

  toView(id) {
    this.props.toViewDrug(id);
  }

  getDrugsList() {
    return this.state.drugs.map((drug) => {
      return <ListItem key={drug._id} drug={drug} link={this.toView} />;
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
        {this.state.drugs.length !== 0 ? (
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">All Drugs in the OPD</h3>
            </div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Drug name</th>
                  <th>Drug type</th>
                  <th>Available quantity</th>
                  <th>unit</th>
                </tr>
              </thead>
              <tbody>{this.getDrugsList()}</tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no drugs in the OPD drug store</h3>
          </div>
        )}
      </div>
    );
  }
}
