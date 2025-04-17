import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { hoverButtonClass } from "../../utils/constants";
import { useMutation } from "@tanstack/react-query";
import { API } from "../../api/API";
import { EndPoints } from "../../utils/enums";
import { sendNotification } from "../../utils/helperMethods";
import RegistrationSuccess from "../common/RegistrationSuccess";
import { useNavigate } from "react-router-dom";
import CommonNavBar from "../common/CommonNavBar";

const ForgotPWD = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const history = useNavigate();

  const { isPending, mutate: forgotPassword } = useMutation({
    mutationFn: (forgotPwd: any) => {
      return API.post(EndPoints.FORGOT_PWD, forgotPwd);
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res) => {
      console.log("res ", res);
      setShowSuccess(true);
    },
  });

  const onFinish = (values: any) => {
    forgotPassword({ username: values.username });
  };

  const renderContent = () => {
    if (showSuccess)
      return (
        <RegistrationSuccess
          headerMessage="Reset Link Sent Successfully"
          message="Your reset password link sent to you email."
        />
      );
    return (
      <div>
        <div className="border-b-2 border-black p-2 mb-1 md:mb-9w-full ">
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            Forgot Password
          </span>
        </div>
        <Form
          className="max-w-2xl mx-auto   rounded-xl p-4 bg-white shadow-lg mt-24"
          onFinish={onFinish}
        >
          <div className="basis-full flex w-full gap-3">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your Email Id!" },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input placeholder="Enter Your Registered Email-ID" />
            </Form.Item>
          </div>

          <div className="text-black flex justify-end gap-4 ">
            <Button
              type="primary"
              htmlType="button"
              className={`${hoverButtonClass} `}
              onClick={() => {
                history("/login");
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={`${hoverButtonClass} `}
              loading={isPending}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  return (
    <>
      <CommonNavBar />
      {renderContent()}
    </>
  );
};

export default ForgotPWD;
