import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { API } from "api/API";
import CommonNavBar from "components/common/CommonNavBar";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { hoverButtonClass } from "utils/constants";
import { EndPoints } from "utils/enums";
import { phoneNumberValidator, sendNotification } from "utils/helperMethods";

const ContactUs = () => {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [form] = useForm();
  const navigate = useNavigate();

  const { isPending, mutate: contactUsMutate } = useMutation({
    mutationFn: (userDetails) => {
      return API.post(EndPoints.CONTACT_US, userDetails);
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.error);
    },
    onSuccess: (res, variables: any) => {
      sendNotification(
        "success",
        "Your Query has been submitted. Soon a representative from our organization will contact you. "
      );

      form.setFieldsValue({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        query: "",
      });

      setCaptchaValue(null);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  const onFinish = (values: any) => {
    if (!captchaValue) {
      sendNotification("error", "Please confirm captcha");
      return;
    }
    contactUsMutate(values);
  };

  return (
    <>
      <CommonNavBar />
      <div className="flex justify-center items-start mt-2 md:mt-16 h-full">
        <div className="flex flex-col w-full md:w-1/2 justify-start items-center  ">
          <div className="mb-4 flex justify-between border-b-2 border-black p-2 text-xl font-bold">
            Contact Us
          </div>
          <span className=" w-full md:w-3/5 p-2 md:p-0  text-center text-gray-500">
            Your feedback matters! Take a moment to share your thoughts with us
            by filling out the form below. We're here to listen and ready to
            assist you.
          </span>
          <Form
            className=" w-full md:w-3/4 mx-auto   p-4  bg-white 
           md:shadow-lg"
            onFinish={onFinish}
            form={form}
          >
            <div className="basis-full flex w-full gap-3">
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: "First Name Required!" }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item name="lastName">
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
                name="email"
                rules={[
                  { required: true, message: "Email ID Required!" },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input placeholder="Email-ID" />
              </Form.Item>
            </div>

            <div className="basis-full flex w-full justify-between gap-3">
              <Form.Item name="query">
                <Input placeholder="Query" />
              </Form.Item>
            </div>
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
                  className={`${hoverButtonClass} mt-4 md:mt-0`}
                  loading={isPending}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
