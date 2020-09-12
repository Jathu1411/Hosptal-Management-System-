import React from "react";

import Navbar from "../components/DisNavBar";
import Footer from "../../shared/components/Footer";

export default function DisDashboard() {
  return (
    <div>
      <div style={{ minHeight: "calc(100vh - 70px" }}>
        <Navbar />
        <div style={{ paddingTop: "60px" }}>Dashboard</div>
        dispenser
      </div>
      <Footer />
    </div>
  );
}
