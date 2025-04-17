import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table } from "antd";
import { CustomSelect } from "components/common/CustomSelect";
import RegistrationDetailsModal from "components/modals/RegistrationDetailsModal";
import RemarksModal from "components/modals/RemarksModal";
import { config } from "config/appConfig";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useLocation } from "react-router-dom";
import { getLoanProductColumns } from "utils/Colums/queueColums";
import { newLoanProductsColumns } from "utils/constants";
import { EndPoints, UserRole } from "utils/enums";
import { sendNotification } from "utils/helperMethods";

const NewLoanProductRegistration = () => {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(
    config.registrations[0]
  );
  const [approvalProps, setApprovalProps] = useState<any>({});
  const [openRemarksModal, setOpenRemarksModal] = useState<boolean>(false);
  const [selectedEmailForUserInfo, setSelectedEmailForUserInfo] =
    useState<any>(null);
  const [loanName, setLoanName] = useState("");
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const isQueuePage = location.pathname === "/queue";

  const { data: queuData, isLoading: queueLoading } = useQuery<any, any>({
    queryKey: ["queue-new-loan-products", selectedRegistration?.value],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.LN_GET_NEW_LOANS, {
        params: { status: selectedRegistration?.value },
      }),
  });

  const { isPending, mutate: triggerRegistration } = useMutation({
    mutationFn: (studentRegistrationData: any) => {
      return axiosPrivate.post(
        EndPoints.LN_UPDATE_NEW_LOAN_PRODUCTS_BY_ADMIN,
        studentRegistrationData
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["queue-new-loan-products"],
      });
      sendNotification("success", res.data?.message);
    },
  });

  const memoisedUrlParams = useMemo(() => {
    if (!loanName) {
      return {};
    }
    return {
      product: "LN-$-" + loanName,
    };
  }, [loanName]);

  const { isLoading: fileUrlLoading, data: fileUrlData } = useQuery<any, any>({
    queryKey: ["file_url", { ...memoisedUrlParams }],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.GET_PRODUCT_FILES, {
        params: {
          ...memoisedUrlParams,
        },
      }),

    enabled: !!loanName,
  });

  useEffect(() => {
    if (!fileUrlLoading && fileUrlData?.data?.downloadURL && loanName) {
      queryClient.invalidateQueries({
        queryKey: ["file_url"],
      });
      window.open(fileUrlData?.data?.downloadURL, "_blank");
      setLoanName("");
    }
  }, [fileUrlLoading, fileUrlData, loanName]);

  const onActionClick = useCallback(
    (rowdata: any, action: string) => {
      setApprovalProps({
        loanName: rowdata["Loan Name"],
        status: action,
      });
      setOpenRemarksModal(true);
    },
    [triggerRegistration]
  );

  const memoisedData = useMemo(() => {
    let result: any[] = [];
    if (!queueLoading) {
      result = queuData?.data?.map((product: any) => {
        const info = product;
        return {
          "Email ID": info?.createdBy,
          "Created By": info?.institutionName,
          "Loan Name": info?.id,
          Attachment: product?.attachments?.[0],
          "Loan Details": info?.loanDetails,
        };
      });
    }

    return result;
  }, [queuData, queueLoading]);

  const onEmailIdClickHandler: any = (emailId: any) => {
    const selRowDetailsData: any = {};
    selRowDetailsData["User Type"] = UserRole.FINANCIAL_INSTITUTION;
    selRowDetailsData["Email ID"] = emailId;
    setSelectedEmailForUserInfo(selRowDetailsData);
    setShowUserInfoModal(true);
  };

  const memoisedColumns = useMemo(() => {
    let columnsNames: any[] = [];
    let maxWidthColumns: any[] = [];

    columnsNames = newLoanProductsColumns;
    const columns = getLoanProductColumns(
      onActionClick,
      selectedRegistration,
      columnsNames,
      maxWidthColumns,
      setLoanName,
      onEmailIdClickHandler
    );
    return columns;
  }, [selectedRegistration, onActionClick]);

  return (
    <div className="p-4 w-full">
      <div className="w-3/4 m-auto rounded-xl overflow-hidden mt-4 table-wrapper">
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
          scroll={{ x: "400", y: 400 }}
          pagination={false}
          bordered
          loading={queueLoading || isPending}
          className="shadow-lg"
        />
      </div>
      {/*REMARKS MODAL */}
      <RemarksModal
        openRemarksModal={openRemarksModal}
        setOpenRemarksModal={setOpenRemarksModal}
        approvalProps={approvalProps}
        onSubmitRemarksCallBack={(props: any) => triggerRegistration(props)}
      />

      {/*USER INFO MODAL */}
      <RegistrationDetailsModal
        selectedShowDetails={selectedEmailForUserInfo}
        setSelectedShowDetails={setSelectedEmailForUserInfo}
        open={showUserInfoModal}
        setOpen={setShowUserInfoModal}
      />
    </div>
  );
};

export default NewLoanProductRegistration;
