import React, { useState, useEffect } from "react";
import Axios from "axios";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./account management/pages/Login";
import TcDashboard from "./opd ticket clerk/TcDashboard";
import CdDashboard from "./opd consultation doctor/CdDashboard";
import DisDashboard from "./opd dispenser/DisDashboard";
import AdDashboard from "./opd admission doctor/AdDashboard";
import IcDashboard from "./opd in charge/IcDashboard";

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
          <Route path="/opd_cd_dashboard" exact component={CdDashboard} />
          <Route path="/opd_dis_dashboard" exact component={DisDashboard} />
          <Route path="/opd_ad_dashboard" exact component={AdDashboard} />
          <Route path="/opd_ic_dashboard" exact component={IcDashboard} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
