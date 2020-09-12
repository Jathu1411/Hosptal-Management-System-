import React from "react";

import Navbar from "../components/DisNavBar";
import Footer from "../../shared/components/Footer";

export default function OpdDrugStore() {
  return (
    <div>
      <div style={{ minHeight: "calc(100vh - 70px" }}>
        <Navbar />
        <div style={{ paddingTop: "60px" }}>Drug store</div>
        dispenser
      </div>
      <Footer />
    </div>
  );
}
