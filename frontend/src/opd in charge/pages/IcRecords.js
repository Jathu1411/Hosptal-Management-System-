import React from "react";

import Navbar from "../components/IcNavBar";
import Footer from "../../shared/components/Footer";

export default function IcRecords() {
  return (
    <div>
      <div style={{ minHeight: "calc(100vh - 70px" }}>
        <Navbar />
        <div style={{ paddingTop: "60px" }}>Records</div>
        In charge
      </div>
      <Footer />
    </div>
  );
}
