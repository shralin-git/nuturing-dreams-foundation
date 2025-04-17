import React, { useContext } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthDataContext } from "../../context/Auth";
import { DefaultRouts, EndPoints } from "../../utils/enums";
import { useMutation } from "@tanstack/react-query";
import { API } from "../../api/API";
import { storeTokens } from "../../auth/localAuth";
import { sendNotification } from "../../utils/helperMethods";
import { hoverButtonClass } from "../../utils/constants";
import CommonNavBar from "components/common/CommonNavBar";

const Login = () => {
  const { setUserRole, setUserName } = useContext(AuthDataContext);
  const history = useNavigate();

  const { isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: (userDetails: any) => {
      return API.post(EndPoints.LOGIN, userDetails);
    },
    onError: (err: any) => {
      console.log("err ", err);
      handleAPIRequest(err?.response);
    },
    onSuccess: (res) => {
      const data: any = res.data;

      if (res.status === 200) {
        setUserRole(data?.userType);
        storeTokens(
          data.idToken,
          data?.refreshToken,
          data?.userType,
          data?.username,
          data
        );
        setUserName(data?.username); // need to get it from api response of LOGIN

        if (data?.isFirstTime) {
          history(`/reset`);
        } else {
          history(`/${DefaultRouts[data.userType]}`);
        }
      } else {
        handleAPIRequest(res);
      }
    },
  });

  const handleAPIRequest = (res: any) => {
    switch (res.status) {
      case 212:
        sendNotification("error", res?.data?.message);
        break;

      case 404:
        sendNotification("error", res?.data?.message);
        break;
      case 501:
        sendNotification("error", res?.data?.message);
        break;
      default:
        break;
    }
  };

  const onFinish = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    mutate({ username: username, password: password });
  };

  const renderLoginContent = () => {
    return (
      <div className=" fixed-height relative z-0 flex ">
        <div className="hidden  md:flex justify-center   items-center   w-full basis-1/2">
          <div
            className="   flex flex-col items-center "
            style={{ left: "20%", top: "10%" }}
          >
            <div
              className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center text-black  shadow-lg shadow-gray-500/50   bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url(./images/logo.png)",
              }}
            ></div>
            <span className="text-4xl font-bold mt-8 ">Nurturing Dreams</span>
            <span className="text-4xl font-bold"> Foundation</span>
          </div>
        </div>
        <div
          className=" flex !w-full md:basis-1/2 md:bg-gray-100  items-center justify-center right-0"
          style={{
            clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
            width: "60vw",
          }}
        >
          <Form
            name="normal_login"
            className="w-full p-8 py-12 ml-8 max-w-xs bg-white pt-12 rounded-xl relative shadow-lg"
            onFinish={onFinish}
          >
            <div className="logo absolute top-0 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 bg-mainFont rounded-full flex items-center justify-center ">
              <UserOutlined
                className="site-form-item-icon text-3xl"
                style={{ color: "white" }}
              />
            </div>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon p-2 text-xl" />
                }
                className="text-xl"
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={
                  <LockOutlined className="site-form-item-icon p-2 text-xl" />
                }
                type="password"
                placeholder="Password"
                className="text-xl"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={`w-full ${hoverButtonClass}  text-xl h-10`}
                loading={isPending}
              >
                Log in
              </Button>
            </Form.Item>
            <div className="flex justify-between items-center">
              <Link
                to="/register"
                className="text-mainFont  hover:!text-mainFontHover   "
              >
                Register now
              </Link>
              <Link
                to="/forgot-pwd"
                className="text-mainFont  hover:!text-mainFontHover   "
              >
                Forgot password
              </Link>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return (
    <>
      <CommonNavBar />
      {renderLoginContent()}
    </>
  );
};

export default Login;
