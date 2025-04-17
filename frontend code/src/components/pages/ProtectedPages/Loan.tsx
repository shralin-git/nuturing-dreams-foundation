import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import { CustomSelect } from "components/common/CustomSelect";
import AddLoanApplicationModal from "components/modals/AddLoanProductModal";
import RegistrationDetailsModal from "components/modals/RegistrationDetailsModal";
import ShowLoanModal from "components/modals/ShowLoanModal";
import { config } from "config/appConfig";
import { AuthDataContext } from "context/Auth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { RxCrossCircled } from "react-icons/rx";
import { ApprovalTypes, EndPoints, UserRole } from "utils/enums";

const Loan = () => {
  const [selectedEmailForUserInfo, setSelectedEmailForUserInfo] =
    useState<any>(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [selectedLoanData, setSelectedLoanData] = useState<any>(null);
  const [addLoanProductModal, setAddLoanProductModal] = useState(false);
  const { userRole } = useContext(AuthDataContext);
  const [selectedLoan, setSelectedLoan] = useState<any>(
    config.loanViewOptions[0]
  );
  const [schShowModal, setSchShowModal] = useState<any>(false);

  const privateAxios = useAxiosPrivate();

  const { data: loanData, isLoading } = useQuery<any, any>({
    queryKey: ["scholarship-view", selectedLoan?.value],
    queryFn: async () =>
      userRole === UserRole.FINANCIAL_INSTITUTION
        ? await privateAxios(
            EndPoints.LN_GET_STUDENTS_APPLI_UNDER_FINANCE_INSTI,
            {
              params: {
                status: selectedLoan?.value,
              },
            }
          )
        : await privateAxios(EndPoints.LN_NEW_LOAN_REGISTRATION, {
            params: {
              status: selectedLoan?.value,
            },
          }),
  });

  useEffect(() => {
    if (selectedId) {
      const schObj = loanData?.data?.userDetails?.find(
        (item: any) => item?.id?.toLocaleUpperCase() === selectedId
      );
      const data = {
        type: schObj?.data?.type,
        product: schObj?.data?.product,
        notes: schObj?.data?.notes,
      };
      setSelectedLoanData(data);
      setSchShowModal(true);
    }
  }, [selectedId]);

  const oncloseModal = () => {
    setSchShowModal(false);
    setSelectedLoanData(null);
    setSelectedId(null);
  };
  const memoisedData = useMemo(() => {
    let results: any[] = [];

    if (loanData?.data?.userDetails) {
      results = loanData?.data?.userDetails.map((item: any) => {
        const info = item.data;
        return {
          "Email ID": info?.username,
          Name: (info?.firstName || "") + " " + (info?.lastName || ""),
          "Loan Name": info?.product,
          "Loan Type": info?.type,
          Status: info?.status,
          "Loan ID": item?.id?.toLocaleUpperCase(),
        };
      });
    }

    return results;
  }, [loanData]);

  const columnNames = [
    "Loan ID",
    "Email ID",
    "Name",
    "Loan Name",
    "Loan Type",
    "Status",
  ];
  const onEmailIdClickHandler = (emailId: any) => {
    const selRowDetailsData: any = {};
    selRowDetailsData["User Type"] = UserRole.STUDENT;
    selRowDetailsData["Email ID"] = emailId;
    setSelectedEmailForUserInfo(selRowDetailsData);
    setShowUserInfoModal(true);
  };
  const getColumns = () => {
    let result: any[] = [];

    result = columnNames.map((columnName: string, idx: number) => {
      return {
        title: columnName,
        dataIndex: columnName,
        width: idx > 3 ? 30 : 60,
        key: columnName,
        fixed: idx === 0 ? "left" : false,
        align: "center",
        render: (columnData: any, rowData: any, rowIndex: number) => {
          if (columnName === "Email ID") {
            return (
              <div
                className="  text-blue-900 cursor-pointer"
                onClick={() => {
                  onEmailIdClickHandler &&
                    onEmailIdClickHandler(rowData["Email ID"]);
                }}
              >
                {rowData[columnName]}
              </div>
            );
          }
          if (columnName === "Loan ID") {
            return (
              <div
                className="  text-blue-900 cursor-pointer"
                onClick={() => {
                  setSelectedId && setSelectedId(rowData["Loan ID"]);
                }}
              >
                {rowData[columnName]}
              </div>
            );
          }
          if (columnName === "Status" && rowData[columnName]) {
            const status = rowData[columnName];
            return (
              <div className="flex justify-center">
                {status === ApprovalTypes.APPROVE && <FcApproval size={20} />}
                {status === ApprovalTypes.REJECT && (
                  <RxCrossCircled size={20} style={{ color: "red" }} />
                )}
                {status === ApprovalTypes.HOLD && (
                  <FaRegStopCircle size={20} style={{ color: "yellowgreen" }} />
                )}
              </div>
            );
          }

          return <div> {rowData[columnName]} </div>;
        },
      };
    });

    return result;
  };

  return (
    <div>
      <div className="flex justify-between border-b-2 border-black p-2">
        <div className="">
          <span className="font-bold text-2xl   mb-4 mr-4 inline  pl-4">
            Loan Applications
          </span>
        </div>
        {userRole === UserRole.FINANCIAL_INSTITUTION && (
          <Button
            type="primary"
            onClick={() => {
              setAddLoanProductModal(true);
            }}
            className="flex bg-mainFont hover:!bg-mainFontHover justify-items-end"
          >
            Create New Loan
          </Button>
        )}
      </div>
      <div className="w-3/4 p-4 m-auto mt-6 table-wrapper">
        <div className="mb-2 ">
          <span className="font-medium text-lg">Status: </span>
          <CustomSelect
            className="w-32 border"
            value={selectedLoan}
            options={config.loanViewOptions}
            onChange={(val: any, item: any) => {
              setSelectedLoan(item);
            }}
          />
        </div>
        <Table
          columns={getColumns()}
          dataSource={memoisedData || []}
          scroll={{ x: "100%", y: 400 }}
          pagination={false}
          bordered
          loading={isLoading}
          className="shadow-lg"
        />
      </div>
      <div className="w-3/4 m-auto flex mt-4 gap-8 pl-8">
        <span className="flex gap-2 items-center">
          <FcApproval size={20} /> Approve
        </span>
        <span className="flex gap-2  items-center">
          <RxCrossCircled size={20} style={{ color: "red" }} /> Reject
        </span>
        <span className="flex gap-2 items-center">
          <FaRegStopCircle size={20} style={{ color: "yellowgreen" }} /> On Hold
        </span>
      </div>
      <AddLoanApplicationModal
        addLoanProductModal={addLoanProductModal}
        setAddLoanProductModal={setAddLoanProductModal}
      />

      {/* LOAN MODAL */}
      <ShowLoanModal
        showModal={schShowModal}
        setShowModal={oncloseModal}
        data={selectedLoanData}
      />

      {/* USER INFO MODAL */}
      <RegistrationDetailsModal
        selectedShowDetails={selectedEmailForUserInfo}
        setSelectedShowDetails={setSelectedEmailForUserInfo}
        open={showUserInfoModal}
        setOpen={setShowUserInfoModal}
      />
    </div>
  );
};

export default Loan;
