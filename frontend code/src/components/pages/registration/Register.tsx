import React, { useContext, useEffect, useState } from "react";
import { FaRightLong } from "react-icons/fa6";
import { UserRole } from "../../../utils/enums";
import {
  Donor,
  EducationalInstitution,
  FinancialInstitution,
  Mentor,
  Student,
} from "../../registration";
import CommonNavBar from "../../common/CommonNavBar";
import "./register.css";
import RegistrationSuccess from "../../common/RegistrationSuccess";
import { RegistrationDataContext } from "../../../context/RegistraionContext";
import OrderPayment from "components/common/OrderPayment";

type props = {
  resetAddUsers?: Function;
};
const Register = ({ resetAddUsers = () => {} }: props) => {
  const { selectedRegistrationStep, setSelectedRegistrationStep, isAdminFlow } =
    useContext(RegistrationDataContext);

  const addText = isAdminFlow ? "Add a" : "Register as a";

  useEffect(() => {
    setSelectedRegistrationStep("");
  }, []);
  const renderRegisterContent = () => {
    switch (selectedRegistrationStep) {
      case UserRole.STUDENT:
        return <Student />;
      case UserRole.DONOR:
        return <Donor />;
      case UserRole.MENTOR:
        return <Mentor />;
      case UserRole.EDUCATIONAL_INSTITUTION:
        return <EducationalInstitution />;
      case UserRole.FINANCIAL_INSTITUTION:
        return <FinancialInstitution />;
      case "success":
        return <RegistrationSuccess />;
      case "orderPayment":
        return <OrderPayment />;

      default:
        return (
          <div
            className="fixed-height m-0 p-0 relative overflow-hidden  "
            style={{
              height: "calc(100vh-64px)",
            }}
          >
            <div className="w-screen  bg-gray-100 md:bg-white rounded-full overflow-hidden absolute left-2/4 top-0 z-10 fixed-height"></div>
            <div className=" flex flex-col md:flex-row justify-around z-20 w-full fixed-height absolute items-center  ">
              <div className=" w-full md:w-[600px] text-2xl text-wrap font-bold  md:text-2xl text-mainFont px-4 md:ml-2">
                Waiting periods are only a step.
                <br /> Registration is only a step.
                <br />
                The prohibition of private firearms is the goal.
              </div>
              <div className="flex flex-col justify-start gap-2.5 text-black text-xl px-2.5 mr-4 font-semibold">
                <div className="flex items-center justify-between gap-2.5">
                  <span className="flex gap-2 items-center">
                    <FaRightLong /> {addText}
                  </span>
                  <span
                    className="text-white cursor-pointer  bg-mainFont  hover:bg-mainFontHover px-3 py-0.5 rounded-lg"
                    onClick={() =>
                      setSelectedRegistrationStep(UserRole.STUDENT)
                    }
                  >
                    Student
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2.5">
                  <span className="flex gap-2 items-center">
                    <FaRightLong /> {addText}
                  </span>
                  <span
                    className="text-white cursor-pointer  bg-mainFont  hover:bg-mainFontHover px-3 py-0.5 rounded-lg"
                    onClick={() => setSelectedRegistrationStep(UserRole.MENTOR)}
                  >
                    Mentor
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2.5">
                  <span className="flex gap-2 items-center">
                    <FaRightLong /> {addText}
                  </span>
                  <span
                    className="text-white cursor-pointer   bg-mainFont  hover:bg-mainFontHover px-3 py-0.5 rounded-lg"
                    onClick={() =>
                      setSelectedRegistrationStep(
                        UserRole.EDUCATIONAL_INSTITUTION
                      )
                    }
                  >
                    Educational Inst
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2.5">
                  <span className="flex gap-2 items-center">
                    <FaRightLong /> {addText}
                  </span>
                  <span
                    className="text-white cursor-pointer   bg-mainFont hover:bg-mainFontHover px-3 py-0.5 rounded-lg"
                    onClick={() =>
                      setSelectedRegistrationStep(
                        UserRole.FINANCIAL_INSTITUTION
                      )
                    }
                  >
                    Financial Inst
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2.5">
                  <span className="flex gap-2 items-center">
                    <FaRightLong /> {addText}
                  </span>
                  <span
                    className="text-white cursor-pointer  bg-mainFont hover:bg-mainFontHover px-3 py-0.5 rounded-lg"
                    onClick={() => setSelectedRegistrationStep(UserRole.DONOR)}
                  >
                    Donor
                  </span>
                </div>
              </div>
            </div>
            {isAdminFlow && (
              <div
                className="absolute   p-2 px-8 rounded-2xl bg-gray-700 text-white right-10 bottom-10 cursor-pointer z-20"
                onClick={() => resetAddUsers()}
              >
                Back
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="relative bg-gray-100 h-screen">
      {!isAdminFlow && <CommonNavBar />}
      {renderRegisterContent()}
      {selectedRegistrationStep && selectedRegistrationStep !== "success" && (
        <div
          className="fixed p-2 px-8 rounded-2xl bg-gray-700 text-white right-10 bottom-10 cursor-pointer"
          onClick={() => setSelectedRegistrationStep("")}
        >
          Back
        </div>
      )}
    </div>
  );
};

export default Register;
