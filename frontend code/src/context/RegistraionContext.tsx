import React, { FC, createContext, useState } from "react";

const noFunc = () => {};

const RegistrationDataContext = createContext<{
  selectedRegistrationStep: string;
  setSelectedRegistrationStep: Function;
  isAdminFlow: string;
  setIsAdminFlow: Function;
  showAddUsers: string;
  setShowAddUsers: Function;
  newUserDetails: any;
  setNewUserDetails: Function;
}>({
  selectedRegistrationStep: "",
  setSelectedRegistrationStep: noFunc,
  isAdminFlow: "",
  setIsAdminFlow: noFunc,
  showAddUsers: "",
  setShowAddUsers: noFunc,
  setNewUserDetails: noFunc,
  newUserDetails: "",
});

type props = {
  children: React.ReactNode;
};

const RegistrationProvider: FC<props> = ({ children }) => {
  const [selectedRegistrationStep, setSelectedRegistrationStep] =
    useState<any>("");
  const [isAdminFlow, setIsAdminFlow] = useState<any>(false);
  const [showAddUsers, setShowAddUsers] = useState<any>(false);
  const [newUserDetails, setNewUserDetails] = useState<any>("");

  return (
    <RegistrationDataContext.Provider
      value={{
        selectedRegistrationStep,
        setSelectedRegistrationStep,
        isAdminFlow,
        setIsAdminFlow,
        showAddUsers,
        setShowAddUsers,
        newUserDetails,
        setNewUserDetails,
      }}
    >
      {children}
    </RegistrationDataContext.Provider>
  );
};

export { RegistrationProvider, RegistrationDataContext };
