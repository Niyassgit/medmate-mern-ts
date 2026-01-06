import PrescriptionList from "@/components/shared/PrescriptionList";
import { getAllPrescriptions } from "../api";
import { useNavigate } from "react-router-dom";
import { PrescriptionDTO } from "@/components/Dto/Prescriptions";

const GuestPrescriptions = () => {
  const navigate = useNavigate();
  const handlePay = (prescription: PrescriptionDTO) => {
    navigate(`/guest/checkout`, { state: prescription });
  };
  return (
    <PrescriptionList
      fetcher={getAllPrescriptions}
      title="My Prescriptions"
      emptyMessage="You don't have any prescriptions yet."
      mode="guest"
      onPay={handlePay}
    />
  );
};

export default GuestPrescriptions;
