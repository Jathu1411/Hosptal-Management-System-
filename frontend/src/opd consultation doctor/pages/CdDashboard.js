import React from "react";

import Navbar from "../components/CdNavBar";
import Footer from "../../shared/components/Footer";

export default function CdDashboard() {
  return (
    <div>
      <div style={{ minHeight: "calc(100vh - 70px" }}>
        <Navbar />
        <div style={{ paddingTop: "60px" }}>Dashboard</div>
        consultant
      </div>
      <Footer />
    </div>
  );
}
