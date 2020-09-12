import React from "react";

import Navbar from "../components/AdNavBar";
import Footer from "../../shared/components/Footer";

export default function AdDashboard() {
  return (
    <div>
      <div style={{ minHeight: "calc(100vh - 70px" }}>
        <Navbar />
        <div style={{ paddingTop: "60px" }}>Dashboard</div>
        Admission doctor
      </div>
      <Footer />
    </div>
  );
}
