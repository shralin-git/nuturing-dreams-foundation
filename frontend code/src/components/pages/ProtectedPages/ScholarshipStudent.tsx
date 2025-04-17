import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import ApplyScholarShipModal from "components/modals/ApplyScholarShipModal";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useMemo, useState } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { MdStars } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { hoverButtonClass } from "utils/constants";
import { ApprovalTypes, EndPoints } from "utils/enums";

const ScholarshipStudent = () => {
  const [applyScholarshipModal, setApplyScholarshipModal] = useState(false);
  const privateAxios = useAxiosPrivate();

  const { data: scholarshipData, isLoading } = useQuery<any, any>({
    queryKey: ["scholarship-status"],
    queryFn: async () =>
      await privateAxios(EndPoints.SCH_GET_SCHOLARSHIP_INFO_OF_USER),
  });

  const memoisedData = useMemo(() => {
    let results: any[] = [];

    if (scholarshipData?.data?.scholarships) {
      results = scholarshipData?.data?.scholarships.map((item: any) => {
        return {
          "Scholarship ID": item?.id?.toLocaleUpperCase(),
          Product: item?.product,
          Type: item?.type,
          Status: item?.status,
        };
      });
    }

    return results;
  }, [scholarshipData]);

  const columnNames = ["Scholarship ID", "Product", "Type", "Status"];
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
          if (columnName === "Status" && rowData[columnName]) {
            const status = rowData[columnName];
            return (
              <div className="flex justify-center">
                {status === ApprovalTypes.NEW && (
                  <MdStars size={20} style={{ color: "orange" }} />
                )}
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
    <div className=" ">
      <div className="border-b-2 border-black p-2 mb-4 w-full flex justify-between mr-8">
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          Scholarship
        </span>
        <Button
          type="primary"
          htmlType="button"
          className={`${hoverButtonClass} `}
          loading={false}
          onClick={() => {
            setApplyScholarshipModal(true);
          }}
        >
          Apply For Scholarship
        </Button>
      </div>
      <div className="flex flex-col justify-start mt-6">
        <div className="m-auto text-xl font-bold">
          Applied Scholarship Status
        </div>
        <div className="w-3/4 m-auto border-2 rounded-xl overflow-hidden mt-2 table-wrapper">
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
            <MdStars size={20} style={{ color: "orange" }} /> New
          </span>
          <span className="flex gap-2 items-center">
            <FcApproval size={20} /> Approve
          </span>
          <span className="flex gap-2  items-center">
            <RxCrossCircled size={20} style={{ color: "red" }} /> Reject
          </span>
          <span className="flex gap-2 items-center">
            <FaRegStopCircle size={20} style={{ color: "yellowgreen" }} /> On
            Hold
          </span>
        </div>
      </div>
      <ApplyScholarShipModal
        applyScholarshipModal={applyScholarshipModal}
        setApplyScholarshipModal={setApplyScholarshipModal}
      />
    </div>
  );
};

export default ScholarshipStudent;
