import dayjs from "dayjs";
import { ApprovalTypes } from "utils/enums";
import { FaFileAlt } from "react-icons/fa";

export const getRegistrationColumns = (
  onActionClick: Function,
  selectedRegistration: any,
  columnsNames: any[],
  maxWidthColumns: any[],
  setSlectedShowDetails?: Function
) => {
  let result: any[] = [];

  result = columnsNames.map((columnName: string, idx: number) => {
    return {
      title: columnName,
      dataIndex: columnName,
      width:
        columnName === "Action"
          ? 200
          : maxWidthColumns.includes(columnName)
          ? 150
          : 100,
      key: columnName,
      fixed: idx === 0 ? "left" : false,
      align: "center",
      render: (columnData: any, rowData: any, rowIndex: number) => {
        if (columnName === "Date Of Birth") {
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
              onClick={() =>
                setSlectedShowDetails && setSlectedShowDetails(rowData)
              }
            >
              {rowData[columnName]}
            </div>
          );
        }
        if (columnName === "Action") {
          return (
            <div className="flex justify-center gap-1 cursor-pointer">
              <div
                className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                onClick={() => {
                  onActionClick(rowData, "approve");
                }}
              >
                Approve
              </div>
              {selectedRegistration.value !== ApprovalTypes.REJECT && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.REJECT);
                  }}
                >
                  Reject
                </div>
              )}
              {selectedRegistration.value !== ApprovalTypes.HOLD && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.HOLD);
                  }}
                >
                  Hold
                </div>
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

export const getSchApplicationColumns = (
  onActionClick: Function,
  selectedRegistration: any,
  columnsNames: any[],
  maxWidthColumns: any[],
  setSelectedId: Function,
  onEmailIdClickHandler: Function
) => {
  let result: any[] = [];

  result = columnsNames.map((columnName: string, idx: number) => {
    return {
      title: columnName,
      dataIndex: columnName,
      width:
        columnName === "Action"
          ? 200
          : maxWidthColumns.includes(columnName)
          ? 150
          : 100,
      key: columnName,
      fixed: idx === 0 ? "left" : false,
      align: "center",
      render: (columnData: any, rowData: any, rowIndex: number) => {
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
        if (columnName === "Action") {
          return (
            <div className="flex justify-center gap-1 cursor-pointer">
              <div
                className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                onClick={() => {
                  onActionClick(rowData, "approve");
                }}
              >
                Approve
              </div>
              {selectedRegistration.value !== ApprovalTypes.REJECT && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.REJECT);
                  }}
                >
                  Reject
                </div>
              )}
              {selectedRegistration.value !== ApprovalTypes.HOLD && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.HOLD);
                  }}
                >
                  Hold
                </div>
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

export const getLoanProductColumns = (
  onActionClick: Function,
  selectedRegistration: any,
  columnsNames: any[],
  maxWidthColumns: any[],
  setLoanName: Function,
  onEmailIdClickHandler: Function
) => {
  let result: any[] = [];

  result = columnsNames.map((columnName: string, idx: number) => {
    return {
      title: columnName,
      dataIndex: columnName,
      width:
        columnName === "Action"
          ? 200
          : maxWidthColumns.includes(columnName)
          ? 150
          : 100,
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
        if (columnName === "Attachment") {
          return (
            <div
              className="cursor-pointer flex justify-center"
              onClick={() => {
                setLoanName(rowData["Loan Name"]);
              }}
            >
              {/* {rowData[columnName]} */}
              {rowData[columnName] && (
                <div
                  className={` rounded flex items-center px-1 py-1 bg-mainFont text-white  hover:!bg-mainFontHover   gap-2   `}
                >
                  <span className="text-xs">View</span>
                  <FaFileAlt size={12} />
                </div>
              )}
            </div>
          );
        }
        if (columnName === "Action") {
          return (
            <div className="flex justify-center gap-1 cursor-pointer">
              <div
                className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                onClick={() => {
                  onActionClick(rowData, ApprovalTypes.APPROVE);
                }}
              >
                Approve
              </div>
              {selectedRegistration.value !== ApprovalTypes.REJECT && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.REJECT);
                  }}
                >
                  Reject
                </div>
              )}
              {selectedRegistration.value !== ApprovalTypes.HOLD && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.HOLD);
                  }}
                >
                  Hold
                </div>
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
export const getSchProductColumns = (
  onActionClick: Function,
  selectedRegistration: any,
  columnsNames: any[],
  onEmailIdClickHandler: Function,
  setSchName: Function,
  maxWidthColumns: any[]
) => {
  let result: any[] = [];

  result = columnsNames.map((columnName: string, idx: number) => {
    return {
      title: columnName,
      dataIndex: columnName,
      width:
        columnName === "Action"
          ? 200
          : maxWidthColumns.includes(columnName)
          ? 150
          : 100,
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
        if (columnName === "Attachment") {
          return (
            <div
              className="cursor-pointer flex justify-center"
              onClick={() => {
                setSchName(rowData["Scholarship Name"]);
              }}
            >
              {/* {rowData[columnName]} */}
              {rowData[columnName] && (
                <div
                  className={` rounded flex items-center px-1 py-1 bg-mainFont text-white  hover:!bg-mainFontHover   gap-2   `}
                >
                  <span className="text-xs">View</span>
                  <FaFileAlt size={12} />
                </div>
              )}
            </div>
          );
        }
        if (columnName === "Action") {
          return (
            <div className="flex justify-center gap-1 cursor-pointer">
              <div
                className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                onClick={() => {
                  onActionClick(rowData, "approve");
                }}
              >
                Approve
              </div>
              {selectedRegistration.value !== ApprovalTypes.REJECT && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.REJECT);
                  }}
                >
                  Reject
                </div>
              )}
              {selectedRegistration.value !== ApprovalTypes.HOLD && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.HOLD);
                  }}
                >
                  Hold
                </div>
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

export const getLoanApplicationColumns = (
  onActionClick: Function,
  selectedRegistration: any,
  columnsNames: any[],
  maxWidthColumns: any[],
  setSelectedId: Function,
  onEmailIdClickHandler: Function
) => {
  let result: any[] = [];

  result = columnsNames.map((columnName: string, idx: number) => {
    return {
      title: columnName,
      dataIndex: columnName,
      width:
        columnName === "Action"
          ? 200
          : maxWidthColumns.includes(columnName)
          ? 150
          : 100,
      key: columnName,
      fixed: idx === 0 ? "left" : false,
      align: "center",
      render: (columnData: any, rowData: any, rowIndex: number) => {
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
        if (columnName === "Action") {
          return (
            <div className="flex justify-center gap-1 cursor-pointer">
              <div
                className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                onClick={() => {
                  onActionClick(rowData, ApprovalTypes.APPROVE);
                }}
              >
                Approve
              </div>
              {selectedRegistration.value !== ApprovalTypes.REJECT && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.REJECT);
                  }}
                >
                  Reject
                </div>
              )}
              {selectedRegistration.value !== ApprovalTypes.HOLD && (
                <div
                  className="p-1 border bg-mainFont rounded-xl text-white text-xs"
                  onClick={() => {
                    onActionClick(rowData, ApprovalTypes.HOLD);
                  }}
                >
                  Hold
                </div>
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
