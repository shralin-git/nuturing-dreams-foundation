import React, { ReactNode } from "react";
import { Navbar, Sidebar } from "../common";

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-gray-100">{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
