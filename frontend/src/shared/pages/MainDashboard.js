import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import UserContext from "../../context/UserContext";

import TcDashboard from "../../shared/pages/MainDashboard";

export default function MainDashboard() {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();

  //logout user
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/");
  };

  //finding unit and post
  const findUnitRole = () => {
    return `${userData.user.unit} ${userData.user.post}`;
  };

  //returning relevant dashboard component
  const getDashboard = () => {
    switch (findUnitRole()) {
      case "OPD Ticket Clerk":
        return <TcDashboard />;
      default:
        return <div></div>;
    }
  };

  return (
    <div>
      {userData.user ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <h1>you are loged out</h1>
      )}

      {getDashboard()}
    </div>
  );
}
