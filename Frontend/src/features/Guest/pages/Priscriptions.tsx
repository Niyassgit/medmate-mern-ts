import React from "react";
import PrescriptionList from "@/components/shared/PrescriptionList";
import { getAllPrescriptions } from "../api";

const GuestPrescriptions = () => {
  return (
    <PrescriptionList
      fetcher={getAllPrescriptions}
      title="My Prescriptions"
      emptyMessage="You don't have any prescriptions yet."
    />
  );
};

export default GuestPrescriptions;
