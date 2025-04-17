import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { EndPoints, UserRole } from "../../../../utils/enums";
import { sendNotification } from "../../../../utils/helperMethods";
import {
  newScholarshipDetailsColumns,
  newUserDetailsWidthColumns,
} from "../../../../utils/constants";
import { getSchApplicationColumns } from "../../../../utils/Colums/queueColums";
import { Table } from "antd";
import ShowScholarshipModal from "components/modals/ShowScholarshipModal";
import { config } from "config/appConfig";
import RegistrationDetailsModal from "components/modals/RegistrationDetailsModal";
import { CustomSelect } from "components/common/CustomSelect";
import { useLocation } from "react-router-dom";
import RemarksModal from "components/modals/RemarksModal";
const NewScholarshipRegistration = () => {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(
    config.registrations[0]
  );
  const [selectedEmailForUserInfo, setSelectedEmailForUserInfo] =
    useState<any>(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [approvalProps, setApprovalProps] = useState<any>({});
  const [openRemarksModal, setOpenRemarksModal] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedScholarshipData, setSelectedScholarshipData] =
    useState<any>(null);

  const [selectedId, setSelectedId] = useState<any>(null);
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const isQueuePage = location.pathname === "/queue";

  const { data: queuData, isLoading: queueLoading } = useQuery<any, any>({
    queryKey: ["queue-scholarship", selectedRegistration?.value],
    queryFn: async () =>
      await axiosPrivate.get(
        EndPoints.SCH_GET_EXISTING_SCHOLARSHIP_BY_VIEW_TYPE,
        {
          params: { status: selectedRegistration?.value },
        }
      ),
  });

  const {
    isPending,
    // isError,
    // isSuccess,
    mutate: triggerRegistration,
  } = useMutation({
    mutationFn: (studentRegistrationData: any) => {
      return axiosPrivate.post(
        EndPoints.SCH_APPROVE_SCHOLARSHIP_BY_ADMIN,
        studentRegistrationData
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["queue-scholarship"],
      });
      sendNotification("success", res.data?.message);
    },
  });

  const onActionClick = (rowdata: any, action: string) => {
    setApprovalProps({
      username: rowdata["Email ID"],
      scholarshipId: rowdata?.scholarshipId,
      status: action,
    });
    setOpenRemarksModal(true);
  };

  const onEmailIdClickHandler = (emailId: any) => {
    const selRowDetailsData: any = {};
    selRowDetailsData["User Type"] = UserRole.STUDENT;
    selRowDetailsData["Email ID"] = emailId;
    setSelectedEmailForUserInfo(selRowDetailsData);
    setShowUserInfoModal(true);
  };

  const memoisedColumns = useMemo(() => {
    let maxWidthColumns: any[] = [];
    let columnsNames: any[] = [];

    maxWidthColumns = newUserDetailsWidthColumns;
    columnsNames = newScholarshipDetailsColumns;

    const columns = getSchApplicationColumns(
      onActionClick,
      selectedRegistration,
      columnsNames,
      maxWidthColumns,
      setSelectedId,
      onEmailIdClickHandler
    );
    return columns;
  }, [setSelectedId, selectedRegistration]);

  const memoisedData = useMemo(() => {
    let result: any[] = [];
    if (!queueLoading) {
      result = queuData?.data?.userDetails?.map((scholar: any) => {
        const info = scholar?.data;
        return {
          "Scholarship ID": scholar?.id?.toLocaleUpperCase(),
          "Email ID": info.username || info.userId,
          Product: info.product,
          Type: info.type,
          scholarshipId: info.scholarshipId,
        };
      });
    }

    return result;
  }, [queuData, queueLoading]);

  useEffect(() => {
    if (selectedId) {
      const data = queuData?.data?.userDetails?.find(
        (item: any) => item?.id?.toLocaleUpperCase() === selectedId
      );
      setSelectedScholarshipData(data?.data);
      setShowModal(true);
    }
  }, [selectedId]);

  const oncloseModal = () => {
    setShowModal(false);
    setSelectedScholarshipData(null);
    setSelectedId(null);
  };

  const commonLoading = queueLoading || isPending;
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
      {/* MODAL */}
      <ShowScholarshipModal
        showModal={showModal}
        setShowModal={oncloseModal}
        data={selectedScholarshipData}
      />

      {/*USER INFO MODAL */}
      <RegistrationDetailsModal
        selectedShowDetails={selectedEmailForUserInfo}
        setSelectedShowDetails={setSelectedEmailForUserInfo}
        open={showUserInfoModal}
        setOpen={setShowUserInfoModal}
      />
      {/*REMARKS MODAL */}
      <RemarksModal
        openRemarksModal={openRemarksModal}
        setOpenRemarksModal={setOpenRemarksModal}
        approvalProps={approvalProps}
        onSubmitRemarksCallBack={(props: any) => triggerRegistration(props)}
      />
    </div>
  );
};

export default NewScholarshipRegistration;
