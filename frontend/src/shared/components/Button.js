import React from "react";

import "./Button.css";

const Button = (props) => {
  if (props.importance === "red") {
    if (props.disabled === "true") {
      return (
        <button type="button" className="normal_button red_button" disabled>
          {props.text}
        </button>
      );
    } else {
      return (
        <button type="button" className="normal_button red_button">
          {props.text}
        </button>
      );
    }
  }
  if (props.disabled === "true") {
    return (
      <button type="button" className="normal_button" disabled>
        {props.text}
      </button>
    );
  } else {
    return (
      <button type="button" className="normal_button">
        {props.text}
      </button>
    );
  }
};

export default Button;
