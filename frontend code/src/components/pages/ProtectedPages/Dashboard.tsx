import React, { useContext } from "react";
import NurturingCard from "../../common/Card";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { AuthDataContext } from "../../../context/Auth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { EndPoints, UserRole } from "../../../utils/enums";

const Dashboard = () => {
  const { userRole } = useContext(AuthDataContext);
  const axiosPrivate = useAxiosPrivate();
  const {
    isLoading,
    error,
    data: dashboardDetails,
  } = useQuery<any, any>({
    queryKey: ["dashboard", userRole],
    queryFn: async () => await axiosPrivate.get(EndPoints.GET_DASHBOARD),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-auto h-full border rounded ">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center my-auto h-full border rounded">
        !! Failed to Fetch Data. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="border-b-2 border-black p-2 mb-1 md:mb-9w-full font-bold text-xl ">
        DASHBOARD
      </div>
      <div
        className={`w-full ${
          userRole === UserRole.ADMIN
            ? "grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xg:grid-cols-5"
            : "flex justify-around flex-wrap"
        }`}
      >
        {Object.keys(dashboardDetails?.data)?.map((key: any) => {
          return (
            <NurturingCard
              header={key}
              count={dashboardDetails.data[key]}
              key={key}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
