import React, { useCallback, useEffect, useMemo, useState } from "react";
import { config } from "../../../../config/appConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { EndPoints, UserRole } from "../../../../utils/enums";
import { sendNotification } from "../../../../utils/helperMethods";
import { newScholarshipProductsColumns } from "../../../../utils/constants";
import { getSchProductColumns } from "../../../../utils/Colums/queueColums";
import { Table } from "antd";
import { CustomSelect } from "components/common/CustomSelect";
import { useLocation } from "react-router-dom";
import RemarksModal from "components/modals/RemarksModal";
import RegistrationDetailsModal from "components/modals/RegistrationDetailsModal";

const NewScholarshipProductRegistration = () => {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(
    config.registrations[0]
  );
  const [approvalProps, setApprovalProps] = useState<any>({});
  const [openRemarksModal, setOpenRemarksModal] = useState<boolean>(false);
  const [selectedEmailForUserInfo, setSelectedEmailForUserInfo] =
    useState<any>(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [schName, setSchName] = useState("");

  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const isQueuePage = location.pathname === "/queue";

  const { data: queuData, isLoading: queueLoading } = useQuery<any, any>({
    queryKey: ["queue-new-sch-products", selectedRegistration?.value],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.SCH_GET_NEW_SCH_PRODUCTS, {
        params: { status: selectedRegistration?.value },
      }),
  });

  const memoisedUrlParams = useMemo(() => {
    if (!schName) {
      return {};
    }
    return {
      product: "SCH-$-" + schName,
    };
  }, [schName]);

  const { isLoading: fileUrlLoading, data: fileUrlData } = useQuery<any, any>({
    queryKey: ["file_url", { ...memoisedUrlParams }],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.GET_PRODUCT_FILES, {
        params: {
          ...memoisedUrlParams,
        },
      }),
    enabled: !!schName,
  });

  // file opening
  useEffect(() => {
    if (!fileUrlLoading && fileUrlData?.data?.downloadURL && schName) {
      window.open(fileUrlData?.data?.downloadURL, "_blank");
      setSchName("");
    }
  }, [fileUrlLoading, fileUrlData, schName]);

  const { isPending, mutate: triggerRegistration } = useMutation({
    mutationFn: (studentRegistrationData: any) => {
      return axiosPrivate.post(
        EndPoints.SCH_UPDATE_NEW_SCH_PRODUCTS_BY_ADMIN,
        studentRegistrationData
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["queue-new-sch-products"],
      });
      sendNotification("success", res.data?.message);
    },
  });

  const onActionClick = useCallback(
    (rowdata: any, action: string) => {
      setApprovalProps({
        scholarshipName: rowdata["Scholarship Name"],
        status: action,
      });
      setOpenRemarksModal(true);
    },
    [triggerRegistration]
  );
  const onEmailIdClickHandler: any = (emailId: any) => {
    const selRowDetailsData: any = {};
    selRowDetailsData["User Type"] = UserRole.DONOR;
    selRowDetailsData["Email ID"] = emailId;
    setSelectedEmailForUserInfo(selRowDetailsData);
    setShowUserInfoModal(true);
  };

  const memoisedColumns = useMemo(() => {
    let columnsNames: any[] = [];
    let maxWidthColumns: any[] = [];

    columnsNames = newScholarshipProductsColumns;
    const columns = getSchProductColumns(
      onActionClick,
      selectedRegistration,
      columnsNames,
      onEmailIdClickHandler,
      setSchName,
      maxWidthColumns
    );
    return columns;
  }, [selectedRegistration, onActionClick]);

  const memoisedData = useMemo(() => {
    let result: any[] = [];
    if (!queueLoading) {
      result = queuData?.data?.map((product: any) => {
        const info = product;
        return {
          "Email ID": info?.createdBy,
          "Created By": info?.firstName + " " + info.lastName,
          "Scholarship Name": info?.id,
          "Scholarship Details": info.scholarshipDetails,
          Attachment: product?.attachments?.[0],
        };
      });
    }
    return result;
  }, [queuData, queueLoading]);

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

export default NewScholarshipProductRegistration;
