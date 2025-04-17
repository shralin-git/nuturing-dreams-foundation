import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Select, Spin } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { EndPoints, UserRole } from "../../utils/enums";
import { API } from "../../api/API";
import { MAX_FILE_SIZE, hoverButtonClass } from "../../utils/constants";
import { useForm } from "antd/es/form/Form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  phoneNumberValidator,
  sendNotification,
} from "../../utils/helperMethods";
import dayjs from "dayjs";
import { useContext, useEffect, useMemo, useState } from "react";
import FormLoader from "./showFormLoader";
import { CiFileOn } from "react-icons/ci";
import { getUserRoleFromLS } from "auth/localAuth";
import { RegistrationDataContext } from "context/RegistraionContext";
import ReCAPTCHA from "react-google-recaptcha";

export type FormProps = {
  onSuccessCallBack?: Function;
  isViewMode?: boolean;
  emailId?: string;
  isEditMode?: boolean;
  isNewUserMode?: boolean;
};

const StudentForm = ({
  onSuccessCallBack,
  isViewMode = false,
  emailId = "",
  isEditMode = false,
  isNewUserMode = false,
}: FormProps) => {
  const [form] = useForm();
  const axiosPrivate = useAxiosPrivate();
  const [attachments, setAttachments] = useState<string[]>([]);
  const [captchaValue, setCaptchaValue] = useState();

  const [selectedInstitutionName, setSelectedInstitutionName] = useState("");
  const userRole: any = getUserRoleFromLS() || "Registration";
  const [fileName, setFileName] = useState("");
  const {
    isAdminFlow,
    setShowAddUsers,
    setSelectedRegistrationStep,
    setNewUserDetails,
  } = useContext(RegistrationDataContext);

  const { isLoading: fetchDataLoader, data: userDetails } = useQuery<any, any>({
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

  const { data: avlInstitutionData } = useQuery<any, any>({
    queryKey: ["aval-institution"],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.GET_AVAILABLE_INSTITUTION),
    enabled: !isViewMode,
  });

  const memoisedAvailableData = useMemo(() => {
    let institutionDropdownData: any[] = [];

    if (avlInstitutionData?.data) {
      institutionDropdownData = avlInstitutionData?.data?.institutionNames?.map(
        (item: string) => {
          return { label: item, value: item };
        }
      );
    }

    institutionDropdownData.push({ label: "Others", value: "Others" });
    return institutionDropdownData;
  }, [avlInstitutionData]);

  const memoisedUrlParams = useMemo(() => {
    if (!fileName) {
      return {};
    }
    return {
      username: userDetails?.data?.email,
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
    if (userDetails?.data) {
      const data = userDetails?.data;
      const attachments = userDetails?.data?.attachments || [];
      setAttachments(attachments);

      if (data?.otherInstitutionName) {
        setSelectedInstitutionName("Others");
      } else {
        setSelectedInstitutionName("");
      }

      form.setFieldsValue({
        ...data,
        dateOfBirth: dayjs(
          Number(data?.dateOfBirth)
            ? data?.dateOfBirth * 1000
            : data?.dateOfBirth
        ),
      });
    }
  }, [userDetails]);

  const { isPending, mutate: createOrEditMutate } = useMutation({
    mutationFn: (studentRegData: any) => {
      if (isEditMode) {
        return axiosPrivate.post(
          EndPoints.UPDATE_STUDENT_PROFILE,
          studentRegData
        );
      }
      return isAdminFlow
        ? axiosPrivate.post(EndPoints.ADMIN_FLOW_REGISTRATION, studentRegData)
        : API.post(EndPoints.USER_REGISTRATION, studentRegData);
      // : API.post(EndPoints.PAYMENT_ORDER, studentRegData);
    },
    onError: (err: any) => {
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res, variables) => {
      setNewUserDetails({
        userType: UserRole.STUDENT,
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

  const {
    isPending: uploadPending,
    isError: uploadError,
    mutate: uploadFiles,
  } = useMutation({
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

  const onFinish = (values: any) => {
    if (!captchaValue) {
      sendNotification("error", "Please confirm captcha");
      return;
    }

    if (attachments.length === 0) {
      sendNotification("error", "Please attach a file to continue");
      return;
    }

    if (isEditMode) {
      const studentUpdateData: any = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).unix(),
        attachments: attachments,
      };
      delete studentUpdateData.email;
      createOrEditMutate(studentUpdateData);
    } else {
      const studentRegData = {
        ...values,
        userType: UserRole.STUDENT,
        attachments: attachments,
        dateOfBirth: dayjs(values.dateOfBirth).unix(),
      };

      createOrEditMutate(studentRegData);
    }
  };

  if (fetchDataLoader) {
    return <FormLoader />;
  }
  const resetUploadName = () => {
    const fileInputRef: any = document.getElementById("unique") || {};
    fileInputRef.value = "";
  };

  const handleChange = (e: any) => {
    const file = e.target.files[0];
    const emailRef: any = document.getElementById("email");
    const emailInput = emailRef?.value;

    if (file?.size > MAX_FILE_SIZE) {
      sendNotification("error", "File size cannot exceed 5MB");
      return;
    }

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
          rules={[{ required: true, message: "Frist Name Required!" }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          rules={[{ required: true, message: "Last Name Required!" }]}
        >
          <Input placeholder="Last Name" />
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
          <Input placeholder="Email-ID" disabled={isEditMode} id="email" />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          rules={[{ required: true, message: "Date Of Birth Required" }]}
        >
          <DatePicker placeholder="Date Of Birth" />
        </Form.Item>
      </div>

      <div className="basis-full flex w-full justify-between gap-3">
        <Form.Item
          name="educationLevel"
          rules={[{ required: true, message: "Education Level Required!" }]}
        >
          <Input placeholder="Education Level" />
        </Form.Item>
        <Form.Item
          name="courseSpecialization"
          rules={[
            { required: true, message: "Course Specification Required!" },
          ]}
        >
          <Input placeholder="Course/Specification" />
        </Form.Item>

        <Form.Item
          name="institution"
          rules={[{ required: true, message: "Institution Name Required!" }]}
        >
          <Select
            placeholder="Institution"
            onChange={(e) => setSelectedInstitutionName(e)}
          >
            {memoisedAvailableData?.map((i: any) => (
              <option value={i?.value}>{i?.label}</option>
            ))}
          </Select>
        </Form.Item>
      </div>
      {/* OTHER INST NAME */}
      {selectedInstitutionName === "Others" && (
        <div style={{ marginBottom: "10px" }}>
          <Form.Item
            name="otherInstitutionName"
            rules={[{ required: true, message: "Institution Name Required!" }]}
          >
            <Input placeholder="Please type institution name here" />
          </Form.Item>
        </div>
      )}
      <div className="basis-full flex w-full gap-3">
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Address Required!" }]}
        >
          <Input placeholder="Address" />
        </Form.Item>
        <Form.Item
          name="university"
          rules={[{ required: true, message: "University Name Required!" }]}
        >
          <Input placeholder="University" />
        </Form.Item>
        <Form.Item
          name="yearOfPassing"
          rules={[{ required: true, message: "Year Of Passing Required!" }]}
        >
          <Input placeholder="Year Of Passing" />
        </Form.Item>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Form.Item
          name="notes"
          rules={[{ required: true, message: "Notes Required!" }]}
        >
          <Input.TextArea placeholder="notes" />
        </Form.Item>
      </div>
      {/* read or edit rights only for below scenario */}
      {[UserRole.ADMIN, UserRole.STUDENT, "Registration"].includes(
        userRole
      ) && (
        <div className="basis-full  w-full gap-3  pointer-events-auto mb-2">
          <div className="text-md font-semibold  text-mainFont mb-2">
            Please attach supporting documents (College ID Card, Course
            completion certificates)
          </div>
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
                    disabled={attachments.length === 10}
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
                    {UserRole.STUDENT === userRole && (
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
          <div className="text-black flex justify-end mt-2 ">
            <Button
              type="primary"
              htmlType="submit"
              className={`${hoverButtonClass} `}
              loading={isPending}
              disabled={uploadPending}
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

export default StudentForm;
