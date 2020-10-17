import React from "react";

import Moment from "moment";

export default function HistoryListItem(props) {
  return (
    <tr onClick={(e) => e.preventDefault()}>
      <td>{Moment(props.action.dateTime).format("DD/MM/YYYY HH:mm")}</td>
      <td>{props.action.actionType}</td>
      <td>{props.action.amount}</td>
      <td>{props.action.balance}</td>
      <td>{props.action.unit}</td>
      <td>{props.action.remarks}</td>
    </tr>
  );
}
