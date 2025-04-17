import { Button, Form, Input } from "antd";
import { hoverButtonClass } from "../../utils/constants";
import { API } from "../../api/API";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  phoneNumberValidator,
  sendNotification,
} from "../../utils/helperMethods";
import { EndPoints, UserRole } from "../../utils/enums";
import { useContext, useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FormLoader from "./showFormLoader";
import dayjs from "dayjs";
import { RegistrationDataContext } from "context/RegistraionContext";
import ReCAPTCHA from "react-google-recaptcha";
import { FormProps } from "./StudentForm";

const FinancialInstitutionForm = ({
  onSuccessCallBack,
  isViewMode = false,
  emailId = "",
  isEditMode = false,
  isNewUserMode = false,
}: FormProps) => {
  const [form] = useForm();
  const axiosPrivate = useAxiosPrivate();
  const [captchaValue, setCaptchaValue] = useState(null);
  const {
    isAdminFlow,
    setShowAddUsers,
    setSelectedRegistrationStep,
    setNewUserDetails,
  } = useContext(RegistrationDataContext);

  const { isLoading: fetchDataLoader, data: financialInstDBData } = useQuery<
    any,
    any
  >({
    queryKey: ["user-details", emailId],
    queryFn: async () =>
      await axiosPrivate.get(
        isNewUserMode
          ? EndPoints.GET_USER_INFO_BY_ID
          : EndPoints.GET_USER_PROFILE,
        {
          params: {
            username: emailId,
          },
        }
      ),
    enabled: !!emailId && (isViewMode || isEditMode),
  });

  useEffect(() => {
    if (financialInstDBData?.data) {
      const data = financialInstDBData?.data;
      form.setFieldsValue({
        ...data,
      });
    }
  }, [financialInstDBData]);

  const { isPending, mutate: createOrEditMutate } = useMutation({
    mutationFn: (financialInstitutionalData) => {
      if (isEditMode) {
        return axiosPrivate.post(
          EndPoints.UPDATE_FINANCIAL_INSTITUTION_PROFILE,
          financialInstitutionalData
        );
      }
      return isAdminFlow
        ? axiosPrivate.post(
            EndPoints.ADMIN_FLOW_REGISTRATION,
            financialInstitutionalData
          )
        : API.post(EndPoints.USER_REGISTRATION, financialInstitutionalData);
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res, variables: any) => {
      setNewUserDetails({
        userType: UserRole.FINANCIAL_INSTITUTION,
        email: variables.email,
      });
      setSelectedRegistrationStep("orderPayment");

      if (onSuccessCallBack && isEditMode) {
        onSuccessCallBack();
      }

      if (isAdminFlow) {
        setShowAddUsers(false);
        sendNotification("success", "User added successfully");
      }
    },
  });

  const onFinish = (values: any) => {
    if (!captchaValue) {
      sendNotification("error", "Please confirm captcha");
      return;
    }
    if (isEditMode) {
      const financiallUpdateData: any = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).unix(),
      };
      delete financiallUpdateData.email;
      createOrEditMutate(financiallUpdateData);
    } else {
      const financialInsData = {
        ...values,
        userType: UserRole.FINANCIAL_INSTITUTION,
      };
      createOrEditMutate(financialInsData);
    }
  };

  if (fetchDataLoader) {
    return <FormLoader />;
  }

  return (
    <>
      <Form
        className={`max-w-2xl mx-auto rounded-xl p-4  bg-white  ${
          isViewMode ? "pointer-events-none" : "shadow-lg"
        }`}
        onFinish={onFinish}
        form={form}
      >
        <div className="basis-full flex w-full gap-3">
          <Form.Item
            name="institutionName"
            rules={[{ required: true, message: "Institution Name Required!" }]}
          >
            <Input placeholder="Institution Name" />
          </Form.Item>

          <Form.Item
            name="institutionType"
            rules={[{ required: true, message: "Institution Type Required!" }]}
          >
            <Input placeholder="Institution Type" />
          </Form.Item>
        </div>
        <div className="basis-full flex w-full justify-between gap-3">
          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Phone Number Required!" },
              { validator: phoneNumberValidator },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email ID Required!" },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input placeholder="Email-ID" disabled={isEditMode} />
          </Form.Item>
        </div>

        <div className="basis-full flex w-full justify-between gap-3">
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Address is Required!" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </div>
        {!isViewMode && (
          <div>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY || ""}
              onChange={(val: any) => {
                setCaptchaValue(val);
              }}
            />
            <div className="text-black flex justify-end  ">
              <Button
                type="primary"
                htmlType="submit"
                className={`${hoverButtonClass} `}
                loading={isPending}
              >
                {isAdminFlow
                  ? "Add User"
                  : isEditMode
                  ? "Update Details"
                  : "Continue to payment"}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </>
  );
};
export default FinancialInstitutionForm;
