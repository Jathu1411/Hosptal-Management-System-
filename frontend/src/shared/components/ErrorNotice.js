import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

//variants = primary, secondary, danger, warning, success, inf0

const ErrorNotice = (props) => {
  const [show, setShow] = useState(true);

  const removeError = () => {
    setShow(false);
    props.clearError();
  };

  if (show) {
    return (
      <Alert
        variant={props.variant}
        onClose={removeError}
        dismissible
        style={{ marginBottom: "0px" }}
      >
        <Alert.Heading style={{ fontSize: "20px" }}>{props.msg}</Alert.Heading>
      </Alert>
    );
  }
  return <div></div>;
};

export default ErrorNotice;
