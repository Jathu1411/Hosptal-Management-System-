import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "./App.css";

//import Login from "./account management/pages/Login";
import TcDashboard from "./ticket clerk/pages/TcDashboard";
// import TcMyAccount from "./ticket clerk/pages/TcMyAccount";
import TcViewAllPatients from "./ticket clerk/pages/TcViewAllPatients";
// import TcSearchAllPatients from "./ticket clerk/pages/TcSearchAllPatients";
// import TcViewPatientDetails from "./ticket clerk/pages/TcViewPatientDetails";
// import TcEditPatientDetails from "./ticket clerk/pages/TcEditPatientDetails";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <TcDashboard />
        </Route>
        <Route path="/opd_patients" exact>
          <TcViewAllPatients />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;

/*
login "/"

Ticket clerk
dashboard "/:uid"
my account "/:uid/account"
view all patients "/opd_patients"
search all patients "/:nic/opd_patients"
view patient details "/:nic/opd_details"
edit patient details "/:nic/edit_opd_details"
*/

/*
<Route path="/:uid" exact>
          <TcDashboard />
        </Route>
<Route path="/:uid/account" exact>
          <TcMyAccount />
        </Route>
        <Route path="/:nic/opd_patients" exact>
          <TcSearchAllPatients />
        </Route>
        <Route path="/:nic/opd_details" exact>
          <TcViewPatientDetails />
        </Route>
        <Route path="/:nic/edit_opd_details" exact>
          <TcEditPatientDetails />
</Route>
*/
