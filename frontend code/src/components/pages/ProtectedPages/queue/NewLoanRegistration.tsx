import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table } from "antd";
import { CustomSelect } from "components/common/CustomSelect";
import RegistrationDetailsModal from "components/modals/RegistrationDetailsModal";
import RemarksModal from "components/modals/RemarksModal";
import ShowLoanModal from "components/modals/ShowLoanModal";
import { config } from "config/appConfig";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLoanApplicationColumns } from "utils/Colums/queueColums";
import {
  newLoanDetailsColumns,
  newUserDetailsWidthColumns,
} from "utils/constants";
import { EndPoints, UserRole } from "utils/enums";
import { sendNotification } from "utils/helperMethods";

const NewLoanRegistration = () => {
  const [selectedId, setSelectedId] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedScholarshipData, setSelectedScholarshipData] =
    useState<any>(null);
  const [approvalProps, setApprovalProps] = useState<any>({});
  const [openRemarksModal, setOpenRemarksModal] = useState<boolean>(false);

  const [selectedEmailForUserInfo, setSelectedEmailForUserInfo] =
    useState<any>(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);

  const [selectedRegistration, setSelectedRegistration] = useState<any>(
    config.registrations[0]
  );
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const isQueuePage = location.pathname === "/queue";
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedId) {
      const data = queuData?.data?.userDetails?.find(
        (item: any) => item?.id?.toLocaleUpperCase() === selectedId
      );
      setSelectedScholarshipData(data?.data);
      setShowModal(true);
    }
  }, [selectedId]);

  const {
    data: queuData,
    error: queueError,
    isLoading: queueLoading,
  } = useQuery<any, any>({
    queryKey: ["queue-loan", selectedRegistration?.value],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.LN_NEW_LOAN_REGISTRATION, {
        params: { status: selectedRegistration?.value },
      }),
  });

  const { isPending, mutate: triggerRegistration } = useMutation({
    mutationFn: (studentRegistrationData: any) => {
      return axiosPrivate.post(
        EndPoints.LN_APPROVE_LOAN_BY_ADMIN,
        studentRegistrationData
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["queue-loan"],
      });
      sendNotification("success", res.data?.message);
    },
  });

  const oncloseModal = () => {
    setShowModal(false);
    setSelectedScholarshipData(null);
    setSelectedId(null);
  };
  const onEmailIdClickHandler = (emailId: any) => {
    const selRowDetailsData: any = {};
    selRowDetailsData["User Type"] = UserRole.STUDENT;
    selRowDetailsData["Email ID"] = emailId;
    setSelectedEmailForUserInfo(selRowDetailsData);
    setShowUserInfoModal(true);
  };
  const onActionClick = (rowdata: any, action: string) => {
    setApprovalProps({
      username: rowdata["Email ID"],
      loanId: rowdata?.["Loan ID"].toLowerCase(),
      status: action,
    });
    setOpenRemarksModal(true);
  };

  const memoisedColumns = useMemo(() => {
    let maxWidthColumns: any[] = [];
    let columnsNames: any[] = [];

    maxWidthColumns = newUserDetailsWidthColumns;
    columnsNames = newLoanDetailsColumns;

    const columns = getLoanApplicationColumns(
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
      result = queuData?.data?.userDetails?.map((loanApplication: any) => {
        const info = loanApplication?.data;
        return {
          "Loan ID": loanApplication?.id?.toLocaleUpperCase(),
          "Email ID": info.username || info.userId,
          Product: info.product,
          Type: info.type,
          scholarshipId: info.scholarshipId,
        };
      });
    }

    return result;
  }, [queuData, queueLoading]);

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
      <div>
        <Table
          columns={memoisedColumns}
          dataSource={memoisedData || []}
          scroll={{ x: "100%", y: 400 }}
          pagination={false}
          bordered
          loading={queueLoading || isPending}
          className="shadow-lg"
        />
      </div>

      {/* MODAL */}
      <ShowLoanModal
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

export default NewLoanRegistration;
