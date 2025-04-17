import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import dayjs from "dayjs";
import { FaRegStopCircle } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { RxCrossCircled } from "react-icons/rx";
import { CustomSelect } from "../../common/CustomSelect";
import { config } from "../../../config/appConfig";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { ApprovalTypes, EndPoints, UserRole } from "../../../utils/enums";
import { AuthDataContext } from "../../../context/Auth";
import AddScholoarShipModal from "../../modals/AddScholoarShipModal";
import ShowScholarshipModal from "components/modals/ShowScholarshipModal";
import RegistrationDetailsModal from "components/modals/RegistrationDetailsModal";

const Scholarship = () => {
  const privateAxios = useAxiosPrivate();
  const [selectedScholarship, setSelectedScholarship] = useState<any>(
    config.scholarshipViewOptions[0]
  );
  const [addScholarshipModel, setAddScholarshipModel] = useState(false);
  const { userRole } = useContext(AuthDataContext);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [schShowModal, setSchShowModal] = useState<any>(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [selectedEmailForUserInfo, setSelectedEmailForUserInfo] =
    useState<any>(null);

  const [selectedScholarshipData, setSelectedScholarshipData] =
    useState<any>(null);

  const { data: scholarshipData, isLoading } = useQuery<any, any>({
    queryKey: ["scholarship-view", selectedScholarship?.value],
    queryFn: async () =>
      userRole === UserRole.EDUCATIONAL_INSTITUTION
        ? await privateAxios(EndPoints.SCH_GET_SCHOLARSHIP_UNDER_INSTITUTION, {
            params: {
              status: selectedScholarship?.value,
            },
          })
        : userRole === UserRole.DONOR
        ? await privateAxios(
            EndPoints.SCH_GET_SCHOLARSHIP_APPLICATIONS_UNDER_DONAR,
            {
              params: {
                status: selectedScholarship?.value,
              },
            }
          )
        : await privateAxios(
            EndPoints.SCH_GET_EXISTING_SCHOLARSHIP_BY_VIEW_TYPE,
            {
              params: {
                status: selectedScholarship?.value,
              },
            }
          ),
  });

  const memoisedData = useMemo(() => {
    let results: any[] = [];

    if (scholarshipData?.data?.userDetails) {
      results = scholarshipData?.data?.userDetails.map((item: any) => {
        const info = item.data;
        return {
          "Email ID": info?.username,
          Name: (info?.firstName || "") + " " + (info?.lastName || ""),
          Product: info?.product,
          Type: info?.type,
          Status: info?.status,
          "Scholarship ID": item?.id?.toLocaleUpperCase(),
        };
      });
    }

    return results;
  }, [scholarshipData]);

  const columnNames = [
    "Scholarship ID",
    "Email ID",
    "Name",
    "Product",
    "Type",
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
          if (columnName === "Date Of Birth" && rowData[columnName]) {
            return (
              <div className="flex justify-center">
                {dayjs.unix(rowData[columnName]).format("DD-MM-YYYY")}
              </div>
            );
          }
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
          if (columnName === "Scholarship ID") {
            return (
              <div
                className="  text-blue-900 cursor-pointer"
                onClick={() => {
                  setSelectedId && setSelectedId(rowData["Scholarship ID"]);
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

  useEffect(() => {
    if (selectedId) {
      const schObj = scholarshipData?.data?.userDetails?.find(
        (item: any) => item?.id?.toLocaleUpperCase() === selectedId
      );
      const data = {
        type: schObj?.data?.type,
        product: schObj?.data?.product,
        notes: schObj?.data?.notes,
      };
      setSelectedScholarshipData(data);
      setSchShowModal(true);
    }
  }, [selectedId]);

  const oncloseModal = () => {
    setSchShowModal(false);
    setSelectedScholarshipData(null);
    setSelectedId(null);
  };

  return (
    <div className=" ">
      <div className="flex justify-between border-b-2 border-black p-2">
        <div className="">
          <span className="font-bold text-2xl   mb-4 mr-4 inline  pl-4">
            Scholarship
          </span>
        </div>
        {userRole === UserRole.DONOR && (
          <Button
            type="primary"
            onClick={() => {
              setAddScholarshipModel(true);
            }}
            className="flex bg-mainFont hover:!bg-mainFontHover justify-items-end"
          >
            Add Scholarship
          </Button>
        )}
      </div>
      <div className="w-3/4 p-4 m-auto mt-6 table-wrapper">
        <div className="mb-2 ">
          <span className="font-medium text-lg">Status: </span>
          <CustomSelect
            className="w-32 border"
            value={selectedScholarship}
            options={config.scholarshipViewOptions}
            onChange={(val: any, item: any) => {
              setSelectedScholarship(item);
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
      <AddScholoarShipModal
        addScholarshipModel={addScholarshipModel}
        setAddScholarshipModel={setAddScholarshipModel}
      />
      {/* SCHOLARSHIP MODAL */}
      <ShowScholarshipModal
        showModal={schShowModal}
        setShowModal={oncloseModal}
        data={selectedScholarshipData}
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

export default Scholarship;
