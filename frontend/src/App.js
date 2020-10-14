import React, { Component } from "react";
import Axios from "axios";

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Login from "./account management/pages/Login";
import TcDashboard from "./opd ticket clerk/pages/TcDashboard";
import TcRecords from "./opd ticket clerk/pages/TcRecords";
import CdDashboard from "./opd consultation doctor/pages/CdDashboard";
import CdRecords from "./opd consultation doctor/pages/CdRecords";
import DisDashboard from "./opd dispenser/pages/DisDashboard";
import OpdDrugStore from "./opd dispenser/pages/OpdDrugStore";
import AdDashboard from "./opd admission doctor/pages/AdDashboard";
import AdRecords from "./opd admission doctor/pages/AdRecords";
import IcDashboard from "./opd in charge/pages/IcDashboard";
import IcRecords from "./opd in charge/pages/IcRecords";
import IcReports from "./opd in charge/pages/IcReports";
import NotAuthorized from "./shared/pages/NotAuthorized";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.isLogined = this.isLogined.bind(this);
    this.isLogin = this.isLogin.bind(this);

    this.state = {
      token: undefined,
      user: undefined,
    };
  }

  componentDidMount() {
    this.isLogined();
  }

  isLogined() {
    //get the local token
    let tokenSession = localStorage.getItem("auth-token");

    //if there no local token create blank local token
    if (tokenSession === null) {
      localStorage.setItem("auth-token", "");
      tokenSession = "";
    }

    //send the local token to check it is valid
    Axios.post(
      "http://localhost:5000/api/users/tokenIsValid",
      {},
      { headers: { "x-auth-token": tokenSession } }
    )
      .then((res) => {
        //if token is valid set the user data and token in local
        if (res.data.valid && this.isLogin()) {
          //not needed
          localStorage.setItem("username", res.data.user.username);
          localStorage.setItem("id", res.data.user.id);
        } else {
          localStorage.setItem("auth-token", "");
          localStorage.setItem("username", "");
          localStorage.setItem("id", "");
          localStorage.setItem("expiration", "");
        }
      })
      .catch((error) => {
        console.log(error);
        localStorage.setItem("auth-token", "");
        localStorage.setItem("username", "");
        localStorage.setItem("id", "");
        localStorage.setItem("expiration", "");
      });
  }

  isLogin() {
    const expiration = localStorage.getItem("expiration");
    const token = localStorage.getItem("auth-token");
    if (
      token === undefined ||
      token === null ||
      token === "" ||
      expiration === "" ||
      new Date(expiration) < new Date()
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/opd_tc_dashboard"
            exact
            render={() =>
              this.isLogin() ? <TcDashboard /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_tc_dashboard/records"
            exact
            render={() =>
              this.isLogin() ? <TcRecords /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_cd_dashboard"
            exact
            render={() =>
              this.isLogin() ? <CdDashboard /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_cd_dashboard/records"
            exact
            render={() =>
              this.isLogin() ? <CdRecords /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_dis_dashboard"
            exact
            render={() =>
              this.isLogin() ? <DisDashboard /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_dis_dashboard/opd_drug_store"
            exact
            render={() =>
              this.isLogin() ? <OpdDrugStore /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_ad_dashboard"
            exact
            render={() =>
              this.isLogin() ? <AdDashboard /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_ad_dashboard/records"
            exact
            render={() =>
              this.isLogin() ? <AdRecords /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_ic_dashboard"
            exact
            render={() =>
              this.isLogin() ? <IcDashboard /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_ic_dashboard/records"
            exact
            render={() =>
              this.isLogin() ? <IcRecords /> : <Redirect to="/" />
            }
          />
          <Route
            path="/opd_ic_dashboard/reports"
            exact
            render={() =>
              this.isLogin() ? <IcReports /> : <Redirect to="/" />
            }
          />
          <Route
            path="/unauthorized"
            exact
            render={() =>
              this.isLogin() ? <NotAuthorized /> : <Redirect to="/" />
            }
          />
          <Route path="/" exact component={Login} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

//added something
