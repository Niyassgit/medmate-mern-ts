import React from "react";
import PrescriptionList from "@/components/shared/PrescriptionList";
import { getAllDoctorPrescriptions } from "../api";

const CommissionCatalogue = () => {
  return (
    <PrescriptionList
      fetcher={getAllDoctorPrescriptions}
      title="Prescriptions You Created"
      emptyMessage="You haven't created any prescriptions."
    />
  );
};

export default CommissionCatalogue;
