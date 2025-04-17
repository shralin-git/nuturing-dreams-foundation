import { useContext } from "react";
import { RegistrationDataContext } from "../../context/RegistraionContext";
import FinancialInstitutionForm from "../forms/FinancialInstitutionForm";

const FinancialInstitution = () => {
  const { setSelectedRegistrationStep } = useContext(RegistrationDataContext);

  const onSuccessCallBack = () => {
    setSelectedRegistrationStep("success");
  };

  return (
    <>
      <div className="border-b-2 border-black p-2 mb-4 md:mb-9w-full ">
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Financial Institution Registration
        </span>
      </div>
      <FinancialInstitutionForm onSuccessCallBack={onSuccessCallBack} />
    </>
  );
};

export default FinancialInstitution;
