import React from "react";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";

import TcDashboard from "./ticket clerk/pages/TcDashboard";

const App = () => {
  return (
    <Router>
      <Route path="/" exact>
        <TcDashboard />
      </Route>
      <Redirect to="/" />
    </Router>
  );
};

export default App;
