import React, { useState } from "react";
import ResetPassword from "../resetPWD/ResetPassword";
import UpdateProfile from "components/common/UpdateProfile";
import { UserRole } from "utils/enums";
import { getUserRoleFromLS } from "auth/localAuth";

const Setting = () => {
  const [selectedSetting, setSelectedSettings] = useState<any>("");

  const userRole = getUserRoleFromLS();
  const renderContent = () => {
    switch (selectedSetting) {
      case "reset-password":
        return <ResetPassword hideCommonNav={true} />;
      case "update-profile":
        return <UpdateProfile setSelectedSettings={setSelectedSettings} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative bg-gray-100  "
      style={{ height: `calc(100vh - 64px)` }}
    >
      <div className="flex flex-col">
        <span className="border-b-2 border-black p-2 mb-1 md:mb-9w-full font-bold text-xl">
          Settings
        </span>

        {!selectedSetting && (
          <>
            <div
              className="flex flex-col rounded h-16  w-64 m-8 items-center justify-center cursor-pointer bg-gradient-to-r from-mainFont to-cardColor"
              style={
                {
                  // background: "linear-gradient(to right, #773970, #8f758f)",
                }
              }
              onClick={() => setSelectedSettings("reset-password")}
            >
              <div className="text-xl font-bold text-white px-2 ml-2">
                Reset Password
              </div>
            </div>
            {UserRole.ADMIN !== userRole && (
              <div
                className="flex flex-col  rounded h-16  w-64 m-8 items-center justify-center cursor-pointer bg-gradient-to-r from-mainFont to-cardColor"
                style={
                  {
                    // background: "linear-gradient(to right, #773970, #8f758f)",
                  }
                }
                onClick={() => setSelectedSettings("update-profile")}
              >
                <div className="text-xl font-bold text-white px-2 ml-2">
                  Update Profile
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-center">
          {renderContent()}
        </div>
        {selectedSetting && (
          <div
            className="fixed p-2 px-8 rounded-2xl bg-gray-700 text-white right-20 bottom-10 cursor-pointer"
            onClick={() => setSelectedSettings("")}
          >
            Back
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
