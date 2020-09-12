import React, { useState, useEffect } from "react";
import Axios from "axios";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "http://localhost:5000/api/users/tokenIsValid",
        {},
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        const userRes = await Axios.get("http://localhost:5000/api/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/opd_tc_dashboard" exact component={TcDashboard} />
          <Route path="/opd_tc_dashboard/records" exact component={TcRecords} />
          <Route path="/opd_cd_dashboard" exact component={CdDashboard} />
          <Route path="/opd_cd_dashboard/records" exact component={CdRecords} />
          <Route path="/opd_dis_dashboard" exact component={DisDashboard} />
          <Route
            path="/opd_dis_dashboard/opd_drug_store"
            exact
            component={OpdDrugStore}
          />
          <Route path="/opd_ad_dashboard" exact component={AdDashboard} />
          <Route path="/opd_ad_dashboard/records" exact component={AdRecords} />
          <Route path="/opd_ic_dashboard" exact component={IcDashboard} />
          <Route path="/opd_ic_dashboard/records" exact component={IcRecords} />
          <Route path="/opd_ic_dashboard/reports" exact component={IcReports} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
