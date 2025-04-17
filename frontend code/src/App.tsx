import "./App.css";
import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import {
  MainHome,
  Login,
  Register,
  Reset,
  ForgotPWD,
  ContactUs,
} from "./components/pages";
import PageContainer from "./components/layouts/PageContainer";
import { AuthDataContext } from "./context/Auth";
import { RoutesEnum, roleRoutesMapping } from "./utils/enums";
import {
  Dashboard,
  Forum,
  Home,
  Chats,
  Queue,
  Scholarship,
  Setting,
  Users,
  ErrorBoundary,
  ScholarshipStudent,
} from "./components/common";
import { RegistrationProvider } from "./context/RegistraionContext";
import "./App.css";
import Loan from "components/pages/ProtectedPages/Loan";
import LoanStudent from "components/pages/ProtectedPages/LoanStudent";

function App() {
  const { userRole } = useContext(AuthDataContext);

  const routeComponentMapping: any = {
    [RoutesEnum.DASHBOARD]: { path: "/dashboard", component: <Dashboard /> },
    [RoutesEnum.SCHOLARSHIP]: {
      path: "/scholarships",
      component: <Scholarship />,
    },
    [RoutesEnum.SCHOLARSHIP_STUDENT]: {
      path: "/scholarship",
      component: <ScholarshipStudent />,
    },
    [RoutesEnum.LOANS]: {
      path: "/loans",
      component: <Loan />,
    },
    [RoutesEnum.LOAN_STUDENT]: {
      path: "/loan",
      component: <LoanStudent />,
    },
    [RoutesEnum.CHATS]: { path: "/chats", component: <Chats /> },
    [RoutesEnum.FORUM]: { path: "/forum", component: <Forum /> },
    [RoutesEnum.SETTINGS]: { path: "/settings", component: <Setting /> },
    [RoutesEnum.QUEUE]: { path: "/queue", component: <Queue /> },
    [RoutesEnum.HOME]: { path: "/home", component: <Home /> },
    [RoutesEnum.USERS]: { path: "/users", component: <Users /> },
  };

  const ProtectedRoutes = () => {
    if (!userRole) return;
    const enabledLinks: Array<string> = roleRoutesMapping[userRole];

    return (
      <>
        {enabledLinks.map((item: string) => {
          const componentInfo = routeComponentMapping[item];
          return (
            <Route
              path={componentInfo.path}
              key={componentInfo.path}
              element={<PageContainer>{componentInfo.component}</PageContainer>}
            />
          );
        })}
      </>
    );
  };

  return (
    <div>
      <ErrorBoundary>
        <RegistrationProvider>
          <Routes>
            <Route path="*" element={<MainHome />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/forgot-pwd" element={<ForgotPWD />} />
            {ProtectedRoutes()}
          </Routes>
        </RegistrationProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
