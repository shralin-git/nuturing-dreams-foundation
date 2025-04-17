import { useEffect, useRef, useState } from "react";
import { FaInfoCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./resetPassword.css";
import CommonNavBar from "../../common/CommonNavBar";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { EndPoints } from "../../../utils/enums";
import { sendNotification } from "../../../utils/helperMethods";
import { getAccessToken, getUserNameFromLS } from "../../../auth/localAuth";
import { Button } from "antd";
import { hoverButtonClass } from "utils/constants";
import { API } from "api/API";

type props = {
  hideCommonNav?: boolean;
};
const ResetPassword = ({ hideCommonNav }: props) => {
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);
  const axiosPrivate = useAxiosPrivate();

  const [currentPwd, setCurrentPwd] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // if token is not there navigate him to login
  const token = getAccessToken();
  if (!token) {
    navigate("/");
  }

  const { mutate: triggerReset, isPending: resetLoading } = useMutation({
    mutationFn: (resetDetails: any) => {
      return axiosPrivate.post(EndPoints.RESET_PWD, resetDetails);
    },
    onError: (err: any) => {
      console.log("err ", err);
      sendNotification("error", err?.response?.data?.message);
    },
    onSuccess: (res) => {
      sendNotification("success", "Password Changed Successfully..!!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const v2 = PWD_REGEX.test(pwd);

    if (currentPwd === pwd) {
      sendNotification("error", "Password cannot be Current Password");
      return;
    }

    if (!currentPwd || !v2) {
      sendNotification("error", "Invalid Entry");
      return;
    } else {
      const d = {
        username: getUserNameFromLS(),
        oldPassword: currentPwd,
        newPassword: pwd,
        confirmNewPassword: matchPwd,
      };

      triggerReset(d);
    }
  };

  const renderRegisterContent = () => {
    return (
      <section className=" reset-section rounded-xl bg-gray-200 text-black shadow-lg">
        <div className="m-auto text-xl font-bold text-black">
          Reset Password
        </div>
        <form onSubmit={handleSubmit} className="reset-form">
          <label htmlFor="currentPwd" className="lbl text-black">
            Current Password:
          </label>
          <input
            type="password"
            id="currentPwd"
            className="text-black pwd"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setCurrentPwd(e.target.value)}
            value={currentPwd}
            required
            aria-describedby="uidnote"
          />

          <label
            htmlFor="password"
            className="flex items-center gap-1 lbl text-black"
          >
            Password:
            <FaCheckCircle className={validPwd ? "valid" : "hide"} />
            <FaTimesCircle className={validPwd || !pwd ? "hide" : "invalid"} />
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            className="text-black pwd"
          />
          <p
            id="pwdnote"
            className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
          >
            <FaInfoCircle />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </p>

          <label
            htmlFor="confirm_pwd"
            className="flex items-center gap-1 lbl text-black"
          >
            Confirm Password:
            <FaCheckCircle
              className={validMatch && matchPwd ? "valid" : "hide"}
            />
            <FaTimesCircle
              className={validMatch || !matchPwd ? "hide" : "invalid"}
            />
          </label>
          <input
            type="password"
            id="confirm_pwd"
            className="text-black pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p
            id="confirmnote"
            className={matchFocus && !validMatch ? "instructions" : "offscreen"}
          >
            <FaInfoCircle />
            Must match the first password input field.
          </p>
          <Button
            disabled={!currentPwd || !validPwd || !validMatch ? true : false}
            className={` w-48 h-10 m-auto text-white hover:!text-white  hover:!border-none  text-lg p-2 mt-8 font-bold ${hoverButtonClass} 
            ${
              !currentPwd || !validPwd || !validMatch
                ? "bg-gray-400 text-black  cursor-not-allowed"
                : " bg-mainFont   "
            }
            `}
            loading={resetLoading}
            htmlType="submit"
            type="primary"
          >
            Save Changes
          </Button>
        </form>
      </section>
    );
  };

  return (
    <>
      {!hideCommonNav && <CommonNavBar />}
      {renderRegisterContent()}
    </>
  );
};

export default ResetPassword;
