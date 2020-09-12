import React from "react";

import TcNavbar from "../components/TcNavBar";
import Footer from "../../shared/components/Footer";

export default function TcRecords() {
  return (
    <div>
      <div style={{ minHeight: "calc(100vh - 70px" }}>
        <TcNavbar />
        <div style={{ paddingTop: "60px" }}>Records</div>
      </div>
      <Footer />
    </div>
  );
}
