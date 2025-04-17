import { useContext } from "react";
import { RegistrationDataContext } from "../../context/RegistraionContext";
import EducationalInstitutionForm from "../forms/EducationalInstitutionForm";

const EducationalInstitution = () => {
  const { setSelectedRegistrationStep } = useContext(RegistrationDataContext);

  const onSuccessCallBack = () => {
    setSelectedRegistrationStep("success");
  };

  return (
    <>
      <div className="border-b-2 border-black p-2 mb-4 md:mb-9w-full ">
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Educational Institution Registration
        </span>
      </div>
      <EducationalInstitutionForm onSuccessCallBack={onSuccessCallBack} />
    </>
  );
};

export default EducationalInstitution;
