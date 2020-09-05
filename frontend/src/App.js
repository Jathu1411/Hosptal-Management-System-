import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

import TcDashboard from "./ticket clerk/pages/TcDashboard";

const App = () => {
  return (
    <Router>
      <Route path="/">
        <TcDashboard />
      </Route>
    </Router>
  );
};

export default App;
