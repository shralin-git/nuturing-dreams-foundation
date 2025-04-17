import { Button, DatePicker, Form, Input, Select, Spin } from "antd";
import { hoverButtonClass } from "../../utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EndPoints, UserRole } from "../../utils/enums";
import { API } from "../../api/API";
import {
  capitalizeWords,
  phoneNumberValidator,
  sendNotification,
} from "../../utils/helperMethods";
import { useContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FormLoader from "./showFormLoader";
import { RegistrationDataContext } from "context/RegistraionContext";
import ReCAPTCHA from "react-google-recaptcha";
import { getUserRoleFromLS } from "auth/localAuth";
import { CiFileOn } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FormProps } from "./StudentForm";

const DonorForm = ({
  onSuccessCallBack,
  isViewMode = false,
  emailId = "",
  isEditMode = false,
  isNewUserMode = false,
}: FormProps) => {
  const [form] = useForm();
  const axiosPrivate = useAxiosPrivate();
  const [captchaValue, setCaptchaValue] = useState();
  const [attachments, setAttachments] = useState<string[]>([]);
  const userRole: any = getUserRoleFromLS() || "Registration";
  const [fileName, setFileName] = useState("");

  const { data: donarTypes } = useQuery({
    queryKey: ["get-donar-types"],
    queryFn: async () => await API.get(EndPoints.SCH_GET_AVAILABLE_DONOR_TYPES),
    enabled: !isViewMode,
  });
  const {
    isAdminFlow,
    setShowAddUsers,
    setSelectedRegistrationStep,
    setNewUserDetails,
  } = useContext(RegistrationDataContext);

  const { isLoading: fetchDataLoader, data: donorDetails } = useQuery<any, any>(
    {
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
    }
  );

  const memoisedUrlParams = useMemo(() => {
    if (!fileName) {
      return {};
    }
    return {
      username: donorDetails?.data?.email,
      filename: fileName,
    };
  }, [fileName]);

  const { isLoading: fileUrlLoading, data: fileUrlData } = useQuery<any, any>({
    queryKey: ["file_url", { ...memoisedUrlParams }],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.GET_FILE_URL_BY_EMAIL_AND_FILE_NAME, {
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

  useEffect(() => {
    if (donorDetails?.data) {
      const data = donorDetails?.data;
      const attachments = donorDetails?.data?.attachments || [];
      setAttachments(attachments);

      form.setFieldsValue({
        ...data,
        dateOfBirth: dayjs(
          Number(data?.dateOfBirth)
            ? data?.dateOfBirth * 1000
            : data?.dateOfBirth
        ),
      });
    }
  }, [donorDetails]);

  const { isPending, mutate: createOrEditMutate } = useMutation({
    mutationFn: (donorRegData) => {
      if (isEditMode) {
        return axiosPrivate.post(EndPoints.UPDATE_DONOR_PROFILE, donorRegData);
      }
      return isAdminFlow
        ? axiosPrivate.post(EndPoints.ADMIN_FLOW_REGISTRATION, donorRegData)
        : API.post(EndPoints.USER_REGISTRATION, donorRegData);
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res, variables: any) => {
      setNewUserDetails({
        userType: UserRole.DONOR,
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
  const { isPending: uploadPending, mutate: uploadFiles } = useMutation({
    mutationFn: (uploadFile) => {
      return API.post(
        EndPoints.ATTACH_FILES_TO_STUDENT_REGISTER_APPLICATION,
        uploadFile,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the Content-Type header
          },
        }
      );
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
  const resetUploadName = () => {
    const fileInputRef: any = document.getElementById("unique") || {};
    fileInputRef.value = "";
  };
  const handleChange = (e: any) => {
    const file = e.target.files[0];
    const emailRef: any = document.getElementById("email");
    const emailInput = emailRef?.value;

    if (!emailInput) {
      sendNotification("error", "Please fill in form details");
      resetUploadName();
      return;
    }

    if (emailInput && file) {
      const upload: any = {
        username: emailInput,
        file: file,
      };
      uploadFiles(upload);
    }
  };
  const getFileUrl = (name: string) => {
    setFileName(name);
  };
  const deleteFile = (name: string) => {
    setAttachments(attachments.filter((i: string) => i !== name));
  };
  const onFinish = (values: any) => {
    if (!captchaValue) {
      sendNotification("error", "Please confirm captcha");
      return;
    }

    if (isEditMode) {
      const donorUpdateData: any = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).unix(),
        attachments: attachments,
      };
      delete donorUpdateData.email;
      createOrEditMutate(donorUpdateData);
    } else {
      const donorRegData = {
        ...values,
        userType: UserRole.DONOR,
        attachments: attachments,
        dateOfBirth: dayjs(values.dateOfBirth).unix(),
      };
      createOrEditMutate(donorRegData);
    }
  };

  if (fetchDataLoader) {
    return <FormLoader />;
  }

  return (
    <Form
      className={`max-w-2xl mx-auto rounded-xl p-4  bg-white  ${
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
          rules={[{ required: true, message: "Required!" }]}
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
      <div className="basis-full flex w-full gap-3">
        <Form.Item
          name="donorType"
          rules={[{ required: true, message: "Donor Type Required!" }]}
          className="w-6/12"
        >
          <Select placeholder="Donor Type">
            {donarTypes?.data?.donorTypes?.map((item: any) => (
              <option value={item.id}>{capitalizeWords(item.id)}</option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Address Required!" }]}
        >
          <Input placeholder="Address" />
        </Form.Item>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Form.Item
          name="notes"
          rules={[{ required: true, message: "Notes Required!" }]}
        >
          <Input.TextArea placeholder="Notes" />
        </Form.Item>
      </div>
      {/* read or edit rights only for below scenario */}
      {[UserRole.ADMIN, UserRole.DONOR, "Registration"].includes(userRole) && (
        <div className="basis-full  w-full gap-3  pointer-events-auto">
          <div className="flex justify-between items-center">
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
                      className="flex gap-2 justify-center items-center flex-1"
                      onClick={() => {
                        getFileUrl(name);
                      }}
                    >
                      {fileName !== name ? <CiFileOn size={30} /> : <Spin />}
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
  );
};

export default DonorForm;
