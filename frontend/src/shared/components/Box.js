import React from "react";

import "./Box.css";

const Box = (props) => {
  return (
    <div className="outer_box_space">
      <div className="box">
        <h1>{props.heading}</h1>
        <hr />
        <div className="inner_content">{props.children}</div>
      </div>
    </div>
  );
};

export default Box;
