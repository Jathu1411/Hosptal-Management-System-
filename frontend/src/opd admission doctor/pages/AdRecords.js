import React from "react";

import Navbar from "../components/AdNavBar";
import Footer from "../../shared/components/Footer";

export default function AdRecords() {
  return (
    <div>
      <div style={{ minHeight: "calc(100vh - 70px" }}>
        <Navbar />
        <div style={{ paddingTop: "60px" }}>Records</div>
        Admission doctor
      </div>
      <Footer />
    </div>
  );
}
