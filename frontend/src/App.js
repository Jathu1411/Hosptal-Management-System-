import React, { useState, useEffect } from "react";
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

import UserContext from "./context/UserContext";

const App = () => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

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
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      //get the local token
      let token = window.sessionStorage.getItem("auth-token");

      //if there no local token create blank local token
      if (token === null) {
        window.sessionStorage.setItem("auth-token", "");
        token = "";
      }
      //send the local token to check it is valid
      const tokenRes = await Axios.post(
        "http://localhost:5000/api/users/tokenIsValid",
        {},
        { headers: { "x-auth-token": token } }
      );
      //if token is valid set the user data and token in local
      if (tokenRes.data) {
        const userRes = await Axios.get("http://localhost:5000/api/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      } else {
        window.sessionStorage.setItem("auth-token", "");
      }
    };

    checkLoggedIn();
  }, []);

  const isLogin = () => {
    if (window.sessionStorage.getItem("auth-token") === undefined) {
      return false;
    } else {
      const token = window.sessionStorage.getItem("auth-token");

      if (token !== "") {
        return true;
      } else {
        window.sessionStorage.setItem("error", "session");
        logout();
        return false;
      }
    }
  };

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Switch>
          <Route
            path="/opd_tc_dashboard"
            exact
            render={() => (isLogin() ? <TcDashboard /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_tc_dashboard/records"
            exact
            render={() => (isLogin() ? <TcRecords /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_cd_dashboard"
            exact
            render={() => (isLogin() ? <CdDashboard /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_cd_dashboard/records"
            exact
            render={() => (isLogin() ? <CdRecords /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_dis_dashboard"
            exact
            render={() => (isLogin() ? <DisDashboard /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_dis_dashboard/opd_drug_store"
            exact
            render={() => (isLogin() ? <OpdDrugStore /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_ad_dashboard"
            exact
            render={() => (isLogin() ? <AdDashboard /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_ad_dashboard/records"
            exact
            render={() => (isLogin() ? <AdRecords /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_ic_dashboard"
            exact
            render={() => (isLogin() ? <IcDashboard /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_ic_dashboard/records"
            exact
            render={() => (isLogin() ? <IcRecords /> : <Redirect to="/" />)}
          />
          <Route
            path="/opd_ic_dashboard/reports"
            exact
            render={() => (isLogin() ? <IcReports /> : <Redirect to="/" />)}
          />
          <Route path="/" exact component={Login} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
