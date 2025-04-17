import { useContext } from "react";
import { RegistrationDataContext } from "../../context/RegistraionContext";
import MentorForm from "../forms/MentorForm";

const Mentor = () => {
  const { setSelectedRegistrationStep } = useContext(RegistrationDataContext);

  const onSuccessCallBack = () => {
    setSelectedRegistrationStep("success");
  };

  return (
    <>
      <div className="border-b-2 border-black p-2 mb-4 md:mb-9w-full">
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Mentor Registration
        </span>
      </div>
      <MentorForm onSuccessCallBack={onSuccessCallBack} />
    </>
  );
};

export default Mentor;
