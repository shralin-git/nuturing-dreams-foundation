import React, { FC, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultRouts, UserRole } from "../utils/enums";
import {
  clearTokens,
  getUserNameFromLS,
  getUserRoleFromLS,
} from "../auth/localAuth";

const noFunc = () => {};

const AuthDataContext = createContext<{
  userName: string;
  setUserName: Function;
  logout: Function;
  userRole: string;
  setUserRole: Function;
  auth: any;
  setAuth: Function;
}>({
  userName: "",
  setUserName: noFunc,
  logout: noFunc,
  userRole: UserRole.DONOR.toString(),
  setUserRole: noFunc,
  auth: undefined,
  setAuth: noFunc,
});

type props = {
  children: React.ReactNode;
};
const AuthProvider: FC<props> = ({ children }) => {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<any>("");
  const [auth, setAuth] = useState({});

  const navigate = useNavigate();

  const logout = () => {
    setUserName("");
    clearTokens();
    navigate("/");
  };

  useEffect(() => {
    const userRole = getUserRoleFromLS();
    if (userRole) {
      setUserRole(userRole);
      setUserName(getUserNameFromLS());
      navigate(`/${DefaultRouts[userRole]}`);
    }
  }, []);

  return (
    <AuthDataContext.Provider
      value={{
        userName,
        setUserName,
        logout,
        userRole,
        setUserRole,
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthDataContext.Provider>
  );
};

export { AuthProvider, AuthDataContext };
