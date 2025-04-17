import { useEffect } from "react";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "../auth/localAuth";
import { API, privateAPI } from "../api/API";
import { EndPoints } from "../utils/enums";
import { useNavigate } from "react-router-dom";

const useAxiosPrivate = () => {
  const refreshtoken = getRefreshToken();
  const accessToken = getAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = privateAPI.interceptors.request.use(
      (config: any) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = accessToken;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    const responseIntercept = privateAPI.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const response = await API.post(EndPoints.REFRESH_TOKEN, {
              refreshtoken,
            });

            const newAccessToken = response?.data?.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            prevRequest.headers["Authorization"] = newAccessToken;
          } catch (err: any) {
            clearTokens();
            navigate("/");
          }
          return privateAPI(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      privateAPI.interceptors.request.eject(requestIntercept);
      privateAPI.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshtoken]);

  return privateAPI;
};

export default useAxiosPrivate;
