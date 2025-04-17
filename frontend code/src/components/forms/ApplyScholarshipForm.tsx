import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Select, Spin } from "antd";
import { getUserNameFromLS } from "auth/localAuth";
import { config } from "config/appConfig";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useEffect, useMemo, useState } from "react";
import { hoverButtonClass } from "utils/constants";
import { EndPoints } from "utils/enums";
import { sendNotification } from "utils/helperMethods";
import { FaFileAlt } from "react-icons/fa";

type props = {
  isViewMode?: boolean;
  formData?: any;
  setApplyScholarshipModal?: Function;
};

const ApplyScholarshipForm = (props: props) => {
  const { isViewMode, formData, setApplyScholarshipModal } = props;
  const privateAxios = useAxiosPrivate();
  const [selectedSCHName, setSelectedSCHName] = useState("");
  const [viewSchFile, setViewSchFile] = useState("");
  const [form] = Form.useForm();
  const username = getUserNameFromLS();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isViewMode) {
      form.setFieldsValue(formData);
      setSelectedSCHName(formData?.product || "");
    }
  }, [formData, isViewMode, form]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  const { data: avalScholarshipData, isLoading: avalScholarshipLoading } =
    useQuery<any, any>({
      queryKey: ["get-scholarship-student"],
      queryFn: async () =>
        await privateAxios(
          EndPoints.SCH_GET_AVAILABLE_SCHOLARSHIPS_FOR_STUDENTS
        ),
    });

  const {
    isPending,
    // isError,
    // isSuccess,
    mutate: triggerSubmitScholarship,
  } = useMutation({
    mutationFn: (schSubmitDetails: any) =>
      privateAxios.post(EndPoints.SCH_SUBMIT_SCHOLARSHIP, schSubmitDetails),
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      sendNotification(
        "success",
        res.data?.message + " " + res.data?.applicationId?.toLocaleUpperCase()
      );
      form.resetFields();
      setSelectedSCHName("");
      setApplyScholarshipModal && setApplyScholarshipModal(false);
      // invalidate scholarship status query to fetch added record
      queryClient.invalidateQueries({
        queryKey: ["scholarship-status"],
      });
    },
  });

  // file view
  const memoisedUrlParams = useMemo(() => {
    if (!viewSchFile) {
      return {};
    }
    return {
      product: "SCH-$-" + viewSchFile,
    };
  }, [viewSchFile]);

  const { isLoading: fileUrlLoading, data: fileUrlData } = useQuery<any, any>({
    queryKey: ["file_url", { ...memoisedUrlParams }],
    queryFn: async () =>
      await privateAxios.get(EndPoints.GET_PRODUCT_FILES, {
        params: {
          ...memoisedUrlParams,
        },
      }),
    enabled: !!viewSchFile,
  });

  // file opening
  useEffect(() => {
    if (!fileUrlLoading && fileUrlData?.data?.downloadURL && viewSchFile) {
      window.open(fileUrlData?.data?.downloadURL, "_blank");
      setViewSchFile("");
    }
  }, [fileUrlLoading, fileUrlData, viewSchFile]);

  const onFinish = (val: any) => {
    triggerSubmitScholarship({ ...val, username: username });
  };

  const isAttachmentPresent =
    avalScholarshipData?.data?.find((item: any) => item.id === selectedSCHName)
      ?.isAttachment || false;

  return (
    <div className="fle flex-col justify-center">
      {!isViewMode && (
        <div className="text-center font-bold text-xl mb-2">
          Apply For Scholarship
        </div>
      )}
      {avalScholarshipLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin />
        </div>
      ) : (
        <Form
          className={` mx-auto rounded-xl p-4  bg-white  `}
          {...formItemLayout}
          variant="filled"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Scholarship Name"
            name="product"
            rules={[
              { required: true, message: "Please select Scholarship name" },
            ]}
            className="relative"
          >
            <Select
              placeholder="Name"
              disabled={isViewMode}
              onChange={(sel) => {
                setSelectedSCHName(sel);
              }}
            >
              {avalScholarshipData?.data?.map((scholarship: any) => {
                return (
                  <option value={scholarship?.id}>{scholarship?.id}</option>
                );
              })}
            </Select>
          </Form.Item>

          {isAttachmentPresent && (
            <div
              className={`absolute right-[70px] ${
                isViewMode ? "top-[68px]" : "top-[72px]"
              } `}
            >
              <Button
                type="primary"
                htmlType="button"
                className={`${hoverButtonClass} flex gap-2 `}
                loading={fileUrlLoading}
                onClick={() => {
                  setViewSchFile(selectedSCHName);
                }}
              >
                {!fileUrlLoading && "View"}
                <FaFileAlt size={20} />
              </Button>
            </div>
          )}

          <Form.Item
            label="Scholarship Purpose"
            name="type"
            rules={[{ required: true, message: "Please select purpose" }]}
          >
            <Select
              placeholder="Purpose"
              disabled={isViewMode}
              className="!text-black"
            >
              {config.purposeForScholarship?.map((item: any) => {
                return <option value={item.value}>{item.label}</option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
            rules={[{ required: true, message: "Please add notes!" }]}
          >
            <Input.TextArea placeholder="Type here..." readOnly={isViewMode} />
          </Form.Item>

          {!isViewMode && (
            <>
              <span className="flex gap-2 text-mainFont m-auto">
                <span className="font-semibold ">Criteria:</span> Scholarship
                can be applied only by college students
              </span>
              <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <div className="text-black flex justify-center md:justify-end  ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={`${hoverButtonClass} `}
                    loading={isPending}
                  >
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
        </Form>
      )}
    </div>
  );
};

export default ApplyScholarshipForm;
