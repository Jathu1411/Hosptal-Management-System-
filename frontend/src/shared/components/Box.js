import React from "react";

import "./Box.css";

const Box = (props) => {
  return (
    <div className="box_space">
      <div className="box">
        <h1>{props.heading}</h1>
        <hr />
      </div>
    </div>
  );
};

export default Box;
