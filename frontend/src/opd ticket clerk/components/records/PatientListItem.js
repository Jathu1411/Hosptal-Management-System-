import React from "react";
import Moment from "moment";

import Button from "react-bootstrap/Button";

export default function ListItem(props) {
  const getButtons = () => {
    return props.buttons.map((button, key) => {
      return (
        <td key={props.patient._id + key}>
          {(props.patient.stage === "in_treatment" ||
            props.patient.stage === "registered") &&
          button.title === "To consultation" ? (
            props.patient.stage === "in_treatment" ? (
              <Button
                variant="primary"
                disabled
                onClick={(e) => {
                  e.stopPropagation();
                  button.onclick(props.patient._id);
                }}
              >
                In treatment
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled
                onClick={(e) => {
                  e.stopPropagation();
                  button.onclick(props.patient._id);
                }}
              >
                In consultation
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                button.onclick(props.patient._id);
              }}
            >
              {button.title}
            </Button>
          )}
        </td>
      );
    });

    // if(props.patient.stage === "registered"){

    // }
  };

  return (
    <tr onClick={() => props.link(props.patient._id, props.from)}>
      <td>{props.patient.name}</td>
      <td>{props.patient.nic}</td>
      <td>{Moment(props.patient.dob).format("DD/MM/YYYY")}</td>
      <td>{Moment().diff(props.patient.dob, "years")}</td>
      <td>{props.patient.address}</td>
      <td>{props.patient.phone}</td>
      <td>{props.patient.gender}</td>
      {getButtons()}
    </tr>
  );
}
