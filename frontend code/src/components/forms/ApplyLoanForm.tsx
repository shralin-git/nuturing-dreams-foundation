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
  setApplyLoanModal?: Function;
};

const ApplyLoanForm = (props: props) => {
  const { isViewMode, formData, setApplyLoanModal } = props;
  const privateAxios = useAxiosPrivate();
  const [selectedLoanName, setSelectedLoanName] = useState("");
  const [viewLoanFile, setViewLoanFile] = useState("");
  const [form] = Form.useForm();
  const username = getUserNameFromLS();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isViewMode) {
      form.setFieldsValue(formData);
      setSelectedLoanName(formData?.product || "");
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

  const { data: avalLoanData, isLoading: avalLoanLoading } = useQuery<any, any>(
    {
      queryKey: ["get-available-loans"],
      queryFn: async () => await privateAxios(EndPoints.LN_GET_AVAILABLE_LOANS),
    }
  );

  const { isPending, mutate: triggerSubmitLoan } = useMutation({
    mutationFn: (schSubmitDetails: any) =>
      privateAxios.post(EndPoints.LN_SUBMIT_LOAN_APPLICATION, schSubmitDetails),
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      sendNotification(
        "success",
        res.data?.message + " " + res.data?.applicationId?.toLocaleUpperCase()
      );
      form.resetFields();
      setSelectedLoanName("");
      setApplyLoanModal && setApplyLoanModal(false);
      // invalidate loan status query to fetch added record
      queryClient.invalidateQueries({
        queryKey: ["loan-status"],
      });
    },
  });

  // file view
  const memoisedUrlParams = useMemo(() => {
    if (!viewLoanFile) {
      return {};
    }
    return {
      product: "LN-$-" + viewLoanFile,
    };
  }, [viewLoanFile]);

  const { isLoading: fileUrlLoading, data: fileUrlData } = useQuery<any, any>({
    queryKey: ["file_url", { ...memoisedUrlParams }],
    queryFn: async () =>
      await privateAxios.get(EndPoints.GET_PRODUCT_FILES, {
        params: {
          ...memoisedUrlParams,
        },
      }),
    enabled: !!viewLoanFile,
  });

  // file opening
  useEffect(() => {
    if (!fileUrlLoading && fileUrlData?.data?.downloadURL && viewLoanFile) {
      window.open(fileUrlData?.data?.downloadURL, "_blank");
      setViewLoanFile("");
    }
  }, [fileUrlLoading, fileUrlData, viewLoanFile]);

  const onFinish = (val: any) => {
    triggerSubmitLoan({ ...val, username: username });
    form.setFieldsValue({ product: "", type: "", notes: "" });
  };

  const isAttachmentPresent =
    avalLoanData?.data?.find((item: any) => item.id === selectedLoanName)
      ?.isAttachment || false;

  return (
    <div className="fle flex-col justify-center">
      {!isViewMode && (
        <div className="text-center font-bold text-xl mb-2">Apply For Loan</div>
      )}
      {avalLoanLoading ? (
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
            label="Loan Product"
            name="product"
            rules={[{ required: true, message: "Please select loan product" }]}
            className="relative"
          >
            <Select
              placeholder="Name"
              disabled={isViewMode}
              onChange={(sel) => {
                setSelectedLoanName(sel);
              }}
            >
              {avalLoanData?.data?.map((loan: any) => {
                return <option value={loan?.id}>{loan?.id}</option>;
              })}
            </Select>
          </Form.Item>

          {isAttachmentPresent && (
            <div
              className={`absolute  right-[70px] ${
                isViewMode ? "top-[68px]" : "top-[72px]"
              }
              `}
            >
              <Button
                type="primary"
                htmlType="button"
                className={`${hoverButtonClass} flex gap-2 `}
                loading={fileUrlLoading}
                onClick={() => {
                  setViewLoanFile(selectedLoanName);
                }}
              >
                {!fileUrlLoading && "View"}
                <FaFileAlt size={20} />
              </Button>
            </div>
          )}

          <Form.Item
            label="Loan Type"
            name="type"
            rules={[{ required: true, message: "Please select Loan Type" }]}
          >
            <Select
              placeholder="Type"
              disabled={isViewMode}
              className="!text-black"
            >
              {config.purposeForLoan?.map((item: any) => {
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
                <span className="font-semibold ">Criteria:</span> Loan can be
                applied only by college students
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

export default ApplyLoanForm;
