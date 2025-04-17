import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Spin } from "antd";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { EndPoints, UserRole } from "../../utils/enums";
import { sendNotification } from "../../utils/helperMethods";
import { useEffect, useMemo, useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { getUserRoleFromLS } from "auth/localAuth";
import { MdDeleteOutline } from "react-icons/md";

const AddScholoarShipModal = ({
  addScholarshipModel,
  setAddScholarshipModel,
  isViewMode = false,
}: any) => {
  const [fileName, setFileName] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [schProductName, setSchProductName] = useState<string>("");
  const [form] = Form.useForm();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const userRole: any = getUserRoleFromLS() || "Registration";
  const privateAxios = useAxiosPrivate();

  const { data: avalScholarshipData, isLoading: avalScholarshipLoading } =
    useQuery<any, any>({
      queryKey: ["get-available-scholarship"],
      queryFn: async () =>
        await privateAxios.get(
          EndPoints.SCH_GET_AVAILABLE_SCHOLARSHIPS_FOR_STUDENTS,
          {
            params: {
              status: "all",
            },
          }
        ),
      enabled: !isViewMode,
    });

  const { isPending, mutate: triggerCreateSchByDonor } = useMutation({
    mutationFn: (createScholarship: any) => {
      return axiosPrivate.post(
        EndPoints.SCH_CREATE_SCH_BY_DONOR,
        createScholarship
      );
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.error);
    },
    onSuccess: (res) => {
      setAddScholarshipModel(false);
      queryClient.invalidateQueries({
        queryKey: ["get-available-scholarship"],
      });
      sendNotification("success", res.data?.message);
      resetFormFields();
    },
  });

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
      product: "SCH-$-" + schProductName,
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

  const getFileUrl = (name: string) => {
    setFileName(name);
  };
  const deleteFile = (name: string) => {
    setAttachments(attachments.filter((i: string) => i !== name));
  };

  const onFinish = (schValues: any) => {
    triggerCreateSchByDonor({ ...schValues, attachments: attachments });
  };

  const resetUploadName = () => {
    const fileInputRef: any = document.getElementById("unique") || {};
    fileInputRef.value = "";
  };

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    const schNameRef: any = document.getElementById("scholarshipName");
    const schName = schNameRef?.value;

    if (!schName) {
      sendNotification("error", "Please fill in name details");
      resetUploadName();
      return;
    }

    if (schName && file) {
      const upload: any = {
        product: "SCH-$-" + schName,
        file: file,
      };
      uploadFiles(upload);
    }
  };

  const validateWithExistingNames = (_: any, value: any) => {
    if (
      !avalScholarshipData?.data
        ?.map((i: any) => i.id?.toLocaleLowerCase())
        ?.includes(value?.toLocaleLowerCase())
    ) {
      setSchProductName(value);
      return Promise.resolve();
    }
    setSchProductName("");
    return Promise.reject(new Error("The scholarship name already exists!"));
  };

  const resetFormFields = () => {
    form.setFieldsValue({ scholarshipName: "", scholarshipDetails: "" });
    setAttachments([]);
  };

  return (
    <div>
      <Modal
        open={addScholarshipModel}
        title="Add Scholarship"
        // onOk={handleOk}
        onCancel={() => {
          resetFormFields();
          setAddScholarshipModel(false);
        }}
        footer={null}
      >
        {avalScholarshipLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin />
          </div>
        ) : (
          <Form className="max-w-2xl mt-4 " onFinish={onFinish} form={form}>
            <div className="basis-full flex w-full gap-3 flex-col">
              <Form.Item
                name="scholarshipName"
                rules={[
                  {
                    required: true,
                    message: "Scholarship Name!",
                  },
                  { validator: validateWithExistingNames },
                ]}
              >
                <Input
                  placeholder="Scholarship Name"
                  onChange={() => setAttachments([])}
                />
              </Form.Item>
              <Form.Item
                name="scholarshipDetails"
                rules={[{ required: true, message: "Scholarship Details!" }]}
              >
                <Input placeholder="Scholarship Details" />
              </Form.Item>

              {/* read or edit rights only for below scenario */}
              {[UserRole.ADMIN, UserRole.DONOR, "Registration"].includes(
                userRole
              ) && (
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
                              schProductName === "" || attachments.length === 1
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
                            {UserRole.DONOR === userRole && (
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
                className={` border-mainFont hover:!bg-mainFontHover text-mainFont`}
                loading={false}
                onClick={() => {
                  resetFormFields();
                  setAddScholarshipModel(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={` bg-mainFont hover:!bg-mainFontHover`}
                loading={isPending}
                disabled={fileUrlLoading}
              >
                Add Scholarship
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AddScholoarShipModal;
