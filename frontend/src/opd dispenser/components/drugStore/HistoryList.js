import React, { Component } from "react";

import Table from "react-bootstrap/Table";
import ListItem from "./HistoryListItem";
import Pagination from "./Pagination";
export default class HistoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentActions: [],
      itemsPerPage: 10,
      currentPage: 1,
    };

    this.geActionList = this.geActionList.bind(this);
    this.onChangePageNumber = this.onChangePageNumber.bind(this);
    this.getNumberOfPages = this.getNumberOfPages.bind(this);
  }

  componentDidMount() {}

  geActionList() {
    const startIndex =
      this.state.itemsPerPage * this.state.currentPage -
      this.state.itemsPerPage;
    const balance =
      this.props.actions.length -
      this.state.itemsPerPage * (this.state.currentPage - 1);
    let endIndex = 0;
    if (balance > this.state.itemsPerPage) {
      endIndex = startIndex + this.state.itemsPerPage;
    } else {
      endIndex = startIndex + balance;
    }
    const currentActions = [];
    for (let number = startIndex; number < endIndex; number++) {
      currentActions.push(this.props.actions[number]);
    }
    return currentActions.map((action) => {
      return <ListItem key={action._id} action={action} />;
    });
  }

  onChangePageNumber(i) {
    this.setState({ currentPage: i });
  }

  getNumberOfPages() {
    return Math.ceil(this.props.actions.length / this.state.itemsPerPage);
  }

  render() {
    return (
      <div>
        {this.props.actions.length !== 0 ? (
          <div>
            <div style={{ paddingBottom: "10px" }}>
              <h3 className="h4">Drug history</h3>
            </div>
            <Table striped hover responsive>
              <thead>
                <tr key="x">
                  <th>Date and time</th>
                  <th>Action type</th>
                  <th>Amount</th>
                  <th>Balance after</th>
                  <th>Unit</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>{this.geActionList()}</tbody>
            </Table>
            <Pagination
              numberOfPages={this.getNumberOfPages()}
              currentPageNumber={this.state.currentPage}
              onChangePageNumber={this.onChangePageNumber}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <h3>There are no drug actions for this drug</h3>
          </div>
        )}
      </div>
    );
  }
}
