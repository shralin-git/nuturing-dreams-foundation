import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { API } from "../../api/API";
import { EndPoints, UserRole } from "../../utils/enums";
import { useContext, useEffect, useState } from "react";
import {
  phoneNumberValidator,
  sendNotification,
} from "../../utils/helperMethods";
import { useForm } from "antd/es/form/Form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import { hoverButtonClass } from "../../utils/constants";
import FormLoader from "./showFormLoader";
import { RegistrationDataContext } from "context/RegistraionContext";
import ReCAPTCHA from "react-google-recaptcha";
import { FormProps } from "./StudentForm";

const MentorForm = ({
  onSuccessCallBack,
  isViewMode = false,
  emailId = "",
  isNewUserMode = false,
  isEditMode = false,
}: FormProps) => {
  const [form] = useForm();
  const axiosPrivate = useAxiosPrivate();
  const [captchaValue, setCaptchaValue] = useState();

  const {
    isAdminFlow,
    setShowAddUsers,
    setSelectedRegistrationStep,
    setNewUserDetails,
  } = useContext(RegistrationDataContext);

  const { isLoading: fetchDataLoader, data: mentorDetails } = useQuery<
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
    if (mentorDetails?.data) {
      const data = mentorDetails?.data;
      form.setFieldsValue({
        ...data,
        dateOfBirth: dayjs(
          Number(data?.dateOfBirth)
            ? data?.dateOfBirth * 1000
            : data?.dateOfBirth
        ),
      });
    }
  }, [mentorDetails]);

  const { isPending, mutate: createOrEditMutate } = useMutation({
    mutationFn: (mentorRegistrationData) => {
      if (isEditMode) {
        return axiosPrivate.post(
          EndPoints.UPDATE_MENTOR_PROFILE,
          mentorRegistrationData
        );
      }
      return isAdminFlow
        ? axiosPrivate.post(
            EndPoints.ADMIN_FLOW_REGISTRATION,
            mentorRegistrationData
          )
        : API.post(EndPoints.USER_REGISTRATION, mentorRegistrationData);
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res, variables: any) => {
      setNewUserDetails({
        userType: UserRole.MENTOR,
        email: variables.email,
      });
      setSelectedRegistrationStep("orderPayment");

      if (onSuccessCallBack && isEditMode) {
        onSuccessCallBack(res);
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
    const mentorRegData = {
      ...values,
      userType: UserRole.MENTOR,
      dateOfBirth: dayjs(values.dateOfBirth).unix(),
    };

    if (isEditMode) {
      delete mentorRegData.email;
    }
    createOrEditMutate(mentorRegData);
  };

  if (fetchDataLoader) {
    return <FormLoader />;
  }

  return (
    <>
      <Form
        className={`max-w-6xl mx-auto rounded-xl p-4  bg-white  ${
          isViewMode ? "pointer-events-none" : "shadow-lg"
        }`}
        onFinish={onFinish}
        form={form}
        style={{ width: isViewMode ? "450px" : "800px" }}
      >
        <div className="basis-full flex w-full gap-3">
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Name Required!" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Last Name Required!" }]}
          >
            <Input placeholder="Last Name" />
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
            name="gender"
            rules={[{ required: true, message: "Gender!" }]}
          >
            <Select placeholder="Gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </Form.Item>
        </div>

        <div className="basis-full flex w-full gap-3 justify-between items-center">
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
          <Form.Item
            name="dateOfBirth"
            rules={[{ required: true, message: "Date Of Birth Required" }]}
          >
            <DatePicker placeholder="Date Of Birth" />
          </Form.Item>
        </div>
        <div className="basis-full flex w-full gap-3 justify-between items-center">
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Address Required!" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>

          <Form.Item
            name="specialization"
            rules={[{ required: true, message: "Specializatoin Required!" }]}
          >
            <Input placeholder="Specialization" />
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
export default MentorForm;
