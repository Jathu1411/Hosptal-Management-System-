import React, { useState, useEffect } from "react";
import Axios from "axios";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Login from "./account management/pages/Login";
import MainDashboard from "./shared/pages/MainDashboard";

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
          <Redirect from="/redirect_dashboard" to="/main-dashboard" />
          <Route path="/main-dashboard" exact component={MainDashboard} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
