import React from "react";

import Box from "../../shared/components/Box";
import Button from "../../shared/components/Button";

const TcDashboard = () => {
  return (
    <div>
      <Box heading="Ticket clerk Dashboard">
        <Button text="View All Patients" importance="red"></Button>
      </Box>
    </div>
  );
};

export default TcDashboard;
