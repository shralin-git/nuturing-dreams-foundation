import React, { useContext, useMemo, useState } from "react";
import { config } from "../../../../config/appConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { EndPoints, UserRole } from "utils/enums";
import { capitalizeWords, sendNotification } from "utils/helperMethods";
import {
  newUserDetailsColumns,
  newUserDetailsWidthColumns,
} from "../../../../utils/constants";
import { Table } from "antd";
import { AuthDataContext } from "context/Auth";
import { getRegistrationColumns } from "utils/Colums/queueColums";
import { CustomSelect } from "components/common/CustomSelect";
import { useLocation } from "react-router-dom";
import RemarksModal from "components/modals/RemarksModal";

type newUserRegProps = {
  setSlectedShowDetails: Function;
  hideActions?: boolean;
  userType?: string;
};
const NewUsersRegistration = ({
  setSlectedShowDetails,
  hideActions = false,
  userType = "",
}: newUserRegProps) => {
  const location = useLocation();
  const isQueuePage = location.pathname === "/queue";
  const [selectedRegistration, setSelectedRegistration] = useState<any>(
    config.registrations[0]
  );

  const [approvalProps, setApprovalProps] = useState<any>({});
  const [openRemarksModal, setOpenRemarksModal] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { userRole } = useContext(AuthDataContext);

  const { data: queuData, isLoading: queueLoading } = useQuery<any, any>({
    queryKey: ["queue-users", selectedRegistration?.value],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.NEW_USERS_REGISTRATION, {
        params: { status: selectedRegistration?.value },
      }),
    enabled: userType === "",
  });

  const { data: usersData, isLoading: usersLoading } = useQuery<any, any>({
    queryKey: ["all-users", userType],
    queryFn: async () =>
      userRole === UserRole.EDUCATIONAL_INSTITUTION
        ? await axiosPrivate.get(EndPoints.GET_STUDENTS_UNDER_INSTITUTION)
        : await axiosPrivate.get(EndPoints.GET_USERS_BY_USER_ROLE, {
            params: { userType: userType },
          }),
    enabled: userType !== "",
  });

  const {
    isPending,
    // isError,
    // isSuccess,
    mutate: triggerRegistration,
  } = useMutation({
    mutationFn: (studentRegistrationData: any) => {
      return axiosPrivate.post(
        EndPoints.REGISTER_APPROVE,
        studentRegistrationData
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["queue-users"],
      });
      sendNotification("success", res.data?.message);
    },
  });

  const onActionClick = (rowdata: any, action: string) => {
    setApprovalProps({
      username: rowdata["Email ID"],
      status: action,
    });
    setOpenRemarksModal(true);
  };

  const memoisedColumns = useMemo(() => {
    let maxWidthColumns: any[] = [];
    let columnsNames: any[] = [];

    maxWidthColumns = newUserDetailsWidthColumns;
    columnsNames = newUserDetailsColumns;
    if (hideActions) {
      columnsNames = columnsNames.filter((col: string) => col !== "Action");
    }

    const columns = getRegistrationColumns(
      onActionClick,
      selectedRegistration,
      columnsNames,
      maxWidthColumns,
      setSlectedShowDetails
    );
    return columns;
  }, [selectedRegistration]);

  const memoisedData = useMemo(() => {
    let result: any[] = [];

    if (userType) {
      if (!usersLoading) {
        result = usersData?.data?.data?.map((user: any) => {
          const info = user;
          return {
            "Email ID": info?.email,
            "User Type": capitalizeWords(info?.userType),
            // Gender: capitalizeWords(info?.gender),
            "Phone Number": info.phoneNumber,
            Address: info.address,
          };
        });
      }
    } else {
      if (!queueLoading) {
        result = queuData?.data?.userDetails?.map((user: any) => {
          const info = user?.data;
          return {
            "Email ID": info?.email,
            "User Type": capitalizeWords(info?.userType || ""),
            // Gender: capitalizeWords(info?.gender || ""),
            "Phone Number": info.phoneNumber,
            Address: info.address,
          };
        });
      }
    }

    return result;
  }, [queuData, queueLoading, usersData, usersLoading, userType]);

  const commonLoading = queueLoading || isPending || usersLoading;
  return (
    <div className="p-4 w-4/5 m-auto mt-6">
      {isQueuePage && (
        <div className="mb-2">
          <span className="font-medium text-lg">Status: </span>
          <CustomSelect
            className="w-48 border"
            value={selectedRegistration}
            options={config.registrations}
            onChange={(val: any, item: any) => {
              setSelectedRegistration(item);
            }}
          />
        </div>
      )}

      <Table
        columns={memoisedColumns}
        dataSource={memoisedData || []}
        scroll={{ x: "100%", y: 400 }}
        pagination={false}
        bordered
        loading={commonLoading}
        className="shadow-lg"
      />
      <RemarksModal
        openRemarksModal={openRemarksModal}
        setOpenRemarksModal={setOpenRemarksModal}
        approvalProps={approvalProps}
        onSubmitRemarksCallBack={(props: any) => triggerRegistration(props)}
      />
    </div>
  );
};

export default NewUsersRegistration;
