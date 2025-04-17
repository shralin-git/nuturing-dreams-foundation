import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Spin } from "antd";
import { getUserRoleFromLS } from "auth/localAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import React, { useEffect, useMemo, useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { EndPoints, UserRole } from "utils/enums";
import { sendNotification } from "utils/helperMethods";

const AddLoanApplicationModal = ({
  addLoanProductModal,
  setAddLoanProductModal,
  isViewMode = false,
}: any) => {
  const [loanProductName, setLoanProductName] = useState<string>("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [form] = Form.useForm();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const userRole: any = getUserRoleFromLS() || "Registration";

  const { data: avalLoanData, isLoading: avalLoanLoading } = useQuery<any, any>(
    {
      queryKey: ["get-available-loans"],
      queryFn: async () =>
        await axiosPrivate.get(EndPoints.LN_GET_AVAILABLE_LOANS, {
          params: {
            status: "all",
          },
        }),
      enabled: !isViewMode,
    }
  );

  const getFileUrl = (name: string) => {
    setFileName(name);
  };
  const deleteFile = (name: string) => {
    setAttachments(attachments.filter((i: string) => i !== name));
  };

  const resetUploadName = () => {
    const fileInputRef: any = document.getElementById("unique") || {};
    fileInputRef.value = "";
  };

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    const loanNameRef: any = document.getElementById("loanName");
    const loanName = loanNameRef?.value;

    if (!loanName) {
      sendNotification("error", "Please fill in name details");
      resetUploadName();
      return;
    }

    if (loanName && file) {
      const upload: any = {
        product: "LN-$-" + loanName,
        file: file,
      };
      uploadFiles(upload);
    }
  };

  const validateWithExistingNames = (y: any, value: any) => {
    if (
      !avalLoanData?.data
        ?.map((i: any) => i.id?.toLocaleLowerCase())
        ?.includes(value?.toLocaleLowerCase())
    ) {
      setLoanProductName(value);
      return Promise.resolve();
    }

    setLoanProductName("");
    return Promise.reject(new Error("The loan name already exists!"));
  };

  const resetFormFields = () => {
    form.setFieldsValue({ loanName: "", loanDetails: "" });
    setAttachments([]);
  };
  const { isPending: uploadPending, mutate: uploadFiles } = useMutation({
    mutationFn: (uploadFile) => {
      return axiosPrivate.post(EndPoints.ATTACH_PRODUCT_FILES, uploadFile, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the Content-Type header
        },
      });
    },
    onError: (err: any) => {
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res) => {
      resetUploadName();
      if (
        res?.data?.filename?.length > 0 &&
        !attachments.includes(res?.data?.filename[0])
      ) {
        setAttachments([...attachments, res?.data?.filename[0]]);
      }
    },
  });

  const memoisedUrlParams = useMemo(() => {
    if (!fileName) {
      return {};
    }
    return {
      // username: donorDetails?.data?.email,
      product: "LN-$-" + loanProductName,
    };
  }, [fileName]);

  const { isLoading: fileUrlLoading, data: fileUrlData } = useQuery<any, any>({
    queryKey: ["file_url", { ...memoisedUrlParams }],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.GET_PRODUCT_FILES, {
        params: {
          ...memoisedUrlParams,
        },
      }),
    enabled: !!userRole && !!fileName,
  });

  useEffect(() => {
    if (!fileUrlLoading && fileUrlData?.data?.downloadURL && fileName) {
      window.open(fileUrlData?.data?.downloadURL, "_blank");
      setFileName("");
    }
  }, [fileUrlLoading, fileUrlData, fileName]);

  const { isPending, mutate: triggerCreateLoan } = useMutation({
    mutationFn: (createScholarship: any) => {
      return axiosPrivate.post(
        EndPoints.LN_CREATE_LOAN_BY_FINANCE_INST,
        createScholarship
      );
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.error);
    },
    onSuccess: (res) => {
      setAddLoanProductModal(false);
      form.resetFields();
      queryClient.invalidateQueries({
        queryKey: ["get-available-loans"],
      });
      sendNotification("success", res.data?.message);
      resetFormFields();
    },
  });

  const onFinish = (values: any) => {
    triggerCreateLoan({ ...values, attachments: attachments });
  };

  return (
    <div>
      <Modal
        open={addLoanProductModal}
        title="Create New Loan"
        // onOk={handleOk}
        onCancel={() => {
          setAddLoanProductModal(false);
          resetFormFields();
        }}
        footer={null}
      >
        {avalLoanLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin />
          </div>
        ) : (
          <Form className="max-w-2xl mt-4 " onFinish={onFinish} form={form}>
            <div className="basis-full flex w-full gap-3 flex-col">
              <Form.Item
                name="loanName"
                rules={[
                  { required: true, message: "Loan Name!" },
                  { validator: validateWithExistingNames },
                ]}
              >
                <Input
                  placeholder="Loan Name"
                  onChange={() => setAttachments([])}
                />
              </Form.Item>
              <Form.Item
                name="loanDetails"
                rules={[{ required: true, message: "Scholarship Details!" }]}
              >
                <Input placeholder="Loan Details" />
              </Form.Item>
              {[
                UserRole.ADMIN,
                UserRole.FINANCIAL_INSTITUTION,
                "Registration",
              ].includes(userRole) && (
                <div className="basis-full  w-full gap-3  pointer-events-auto">
                  <div className="flex flex-col justify-between items-center">
                    {!isViewMode && (
                      <div className="basis-full flex w-full gap-3 justify-between items-center mb-2">
                        {uploadPending ? (
                          <div className="w-full flex justify-center items-center">
                            <Spin />
                          </div>
                        ) : (
                          <input
                            type="file"
                            onChange={handleChange}
                            name="upload"
                            id="unique"
                            className="!bg-white"
                            disabled={
                              loanProductName === "" || attachments.length === 1
                            }
                          />
                        )}
                      </div>
                    )}

                    <div
                      className={`w-full overflow-y-scroll  ${
                        attachments.length > 0 ? "h-24" : ""
                      }`}
                    >
                      {attachments?.map((name: string, index: number) => {
                        return (
                          <div className="flex items-center justify-between border  my-2 rounded cursor-pointer">
                            <div
                              className="flex gap-2 justify-start items-center flex-1"
                              onClick={() => {
                                getFileUrl(name);
                              }}
                            >
                              {fileName !== name ? (
                                <CiFileOn size={30} />
                              ) : (
                                <Spin />
                              )}
                              <div
                                className=" p-2   block   truncate"
                                style={{ width: "237px" }}
                              >
                                {name}
                              </div>
                            </div>
                            {UserRole.FINANCIAL_INSTITUTION === userRole && (
                              <div
                                className="mx-2 flex justify-center items-center"
                                onClick={() => deleteFile(name)}
                              >
                                <MdDeleteOutline
                                  size={20}
                                  className="hover:text-red-700"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-black flex justify-end gap-2  ">
              <Button
                type="primary"
                htmlType="button"
                className={` border-mainFont  text-mainFont ${
                  isPending ? "" : "hover:!bg-mainFontHover"
                } `}
                onClick={() => {
                  setAddLoanProductModal(false);
                  resetFormFields();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={` bg-mainFont hover:!bg-mainFontHover`}
                loading={isPending}
                disabled={uploadPending}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AddLoanApplicationModal;
