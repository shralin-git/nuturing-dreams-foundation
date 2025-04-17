import { useContext } from "react";
import { RegistrationDataContext } from "../../context/RegistraionContext";
import DonorForm from "../forms/DonorForm";

const Donor = () => {
  const { setSelectedRegistrationStep } = useContext(RegistrationDataContext);

  const onSuccessCallBack = () => {
    setSelectedRegistrationStep("success");
  };
  return (
    <>
      <div className="border-b-2 border-black p-2 mb-4 md:mb-9w-full">
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Donor Registration
        </span>
      </div>
      <DonorForm onSuccessCallBack={onSuccessCallBack} />
    </>
  );
};

export default Donor;
