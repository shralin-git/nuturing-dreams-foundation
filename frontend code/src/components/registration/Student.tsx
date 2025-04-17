import { useContext } from "react";
import { RegistrationDataContext } from "../../context/RegistraionContext";
import StudentForm from "../forms/StudentForm";

const Student = () => {
  const { setSelectedRegistrationStep } = useContext(RegistrationDataContext);

  const onSuccessCallBack = () => {
    setSelectedRegistrationStep("success");
  };
  return (
    <>
      <div className="border-b-2 border-black p-2 mb-4 w-full">
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Student Registration
        </span>
      </div>
      <StudentForm onSuccessCallBack={onSuccessCallBack} />
    </>
  );
};

export default Student;
