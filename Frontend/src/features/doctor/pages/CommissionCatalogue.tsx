import React from "react";
import PrescriptionList from "@/components/shared/PrescriptionList";
import { getAllDoctorPrescriptions } from "../api";

const CommissionCatalogue = () => {

  const handlePay=()=>{
    
  }
  return (
    <PrescriptionList
      fetcher={getAllDoctorPrescriptions}
      title="Prescriptions You Created"
      mode="doctor"
      emptyMessage="You haven't created any prescriptions."
      onPay={handlePay}
    />
  );
};

export default CommissionCatalogue;
