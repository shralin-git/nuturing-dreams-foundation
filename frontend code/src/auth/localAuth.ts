import { UserRole } from "../utils/enums";

// Function to store tokens in localStorage with expiry time
export const storeTokens = (
  accessToken: string,
  refreshToken: string,
  userRole: string,
  username: string,
  auth: any
) => {
  const names: any = {
    firstName: auth?.firstName,
    lastName: auth?.lastName,
    name: auth?.institutionName,
  };
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("token", userRoleToken[userRole]); // its nothing but USER ROLE
  localStorage.setItem("username", username); // its nothing but USER ROLE
  localStorage.setItem("displayName", JSON.stringify(names)); // its nothing but USER ROLE
};

// Function to retrieve access token from localStorage
export const getAccessToken = () => {
  //   const accessTokenExpiryTime = localStorage.getItem("accessTokenExpiryTime");
  //   if (!accessTokenExpiryTime || parseInt(accessTokenExpiryTime) < Date.now()) {
  //     // Token expired or not found
  //     clearTokens();
  //     return null;
  //   }
  return localStorage.getItem("accessToken");
};

export const getDisplayNameFromLs = () => {
  const obj = JSON.parse(localStorage.getItem("displayName") || "");

  if (obj?.name) {
    return obj.name;
  }
  return obj.firstName + " " + obj.lastName;
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const getUserRoleFromLS = () => {
  const roleValue = localStorage.getItem("token");
  const userRole = Object.keys(userRoleToken).find(
    (i: any) => userRoleToken[i] === roleValue
  );
  return userRole;
};

export const getUserNameFromLS = () => {
  return localStorage.getItem("username") || "";
};

export const clearTokens = () => {
  localStorage.clear();
};

// mapping user role to random string to keep it safe
const userRoleToken: any = {
  [UserRole.ADMIN]: "aldjfaj233459ajfafjfa2341askdfjasf458asjfdajfajfd673lajfd",
  [UserRole.DONOR]: "aldjfaj233459ajfafjfa2342askdfjasf458bsjfdajfajfd673lajfd",
  [UserRole.MENTOR]:
    "aldjfaj233459ajfafjfa2343askdfjasf458csjfdajfajfd673lajfd",
  [UserRole.STUDENT]:
    "aldjfaj233459ajfafjfa2344askdfjasf458dsjfdajfajfd673lajfd",
  [UserRole.EDUCATIONAL_INSTITUTION]:
    "aldjfaj235459ajfafjfa2349askdfjasf458esjfdajfajfd673lajfd",
  [UserRole.FINANCIAL_INSTITUTION]:
    "aldjfaj233456ajfafjfa2349askdfjasf458fsjfdajfajfd673lajfd",
};
