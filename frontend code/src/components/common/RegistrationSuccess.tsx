import { RegistrationDataContext } from "context/RegistraionContext";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { hoverButtonClass } from "utils/constants";

const RegistrationSuccess = ({
  headerMessage = "  Registration Successful",
  message = " Your registration is successful. An admin will review your application shortly. You will receive an email notification on completion",
}: {
  headerMessage?: string;
  message?: string;
}) => {
  const { isAdminFlow, setShowAddUsers } = useContext(RegistrationDataContext);
  headerMessage = isAdminFlow ? "User added Successfully" : headerMessage;
  message = isAdminFlow ? "" : message;

  return (
    <div className="fixed-height flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">{headerMessage}</h2>
        <p className="text-center text-gray-700 mb-6">{message}</p>
        <div className="text-center">
          {isAdminFlow ? (
            <button
              className={`${hoverButtonClass} w-1/2 m-auto  `}
              onClick={() => setShowAddUsers(false)}
            >
              Go to Users
            </button>
          ) : (
            <Link
              className="bg-mainFont hover:bg-mainFontHover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              to={"/"}
            >
              Go to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
