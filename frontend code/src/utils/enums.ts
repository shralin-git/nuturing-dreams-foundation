export enum UserRole {
  STUDENT = "student",
  MENTOR = "mentor",
  EDUCATIONAL_INSTITUTION = "institution",
  FINANCIAL_INSTITUTION = "financial Institution",
  DONOR = "donor",
  ADMIN = "admin",
}

export enum RoutesEnum {
  DASHBOARD = "dashboard",
  QUEUE = "queue",
  SCHOLARSHIP = "scholarships",
  SCHOLARSHIP_STUDENT = "scholarship",
  CHATS = "chats",
  FORUM = "forum",
  SETTINGS = "settings",
  HOME = "home",
  USERS = "users",
  ADD_USERS = "add-users",
  LOANS = "loans",
  LOAN_STUDENT = "loan",
}

export const DefaultRouts: any = {
  [UserRole.ADMIN]: RoutesEnum.DASHBOARD,
  [UserRole.DONOR]: RoutesEnum.DASHBOARD,
  [UserRole.MENTOR]: RoutesEnum.FORUM,
  [UserRole.STUDENT]: RoutesEnum.DASHBOARD,
  [UserRole.EDUCATIONAL_INSTITUTION]: RoutesEnum.DASHBOARD,
  [UserRole.FINANCIAL_INSTITUTION]: RoutesEnum.DASHBOARD,
};

export const roleRoutesMapping: any = {
  [UserRole.ADMIN]: [
    RoutesEnum.DASHBOARD,
    RoutesEnum.QUEUE,
    RoutesEnum.SCHOLARSHIP,
    RoutesEnum.LOANS,
    RoutesEnum.USERS,
    RoutesEnum.FORUM,
    RoutesEnum.SETTINGS,
  ],
  [UserRole.STUDENT]: [
    RoutesEnum.DASHBOARD,
    RoutesEnum.SCHOLARSHIP_STUDENT,
    RoutesEnum.LOAN_STUDENT,
    RoutesEnum.FORUM,
    RoutesEnum.CHATS,
    RoutesEnum.SETTINGS,
  ],
  [UserRole.MENTOR]: [RoutesEnum.FORUM, RoutesEnum.CHATS, RoutesEnum.SETTINGS],
  [UserRole.DONOR]: [
    RoutesEnum.DASHBOARD,
    RoutesEnum.SCHOLARSHIP,
    RoutesEnum.SETTINGS,
  ],
  [UserRole.FINANCIAL_INSTITUTION]: [
    RoutesEnum.DASHBOARD,
    RoutesEnum.LOANS,
    RoutesEnum.USERS,
    RoutesEnum.SETTINGS,
  ],
  [UserRole.EDUCATIONAL_INSTITUTION]: [
    RoutesEnum.DASHBOARD,
    RoutesEnum.SCHOLARSHIP,
    RoutesEnum.USERS,
    RoutesEnum.SETTINGS,
  ],
};

export enum EndPoints {
  LOGIN = "/login",
  RESET_PWD = "resetPassword",
  CONTACT_US = "ContactUs",
  FORGOT_PWD = "forgotPassword",
  REGISTER_APPROVE = "/registerUser",
  REFRESH_TOKEN = "/refreshToken",
  USER_REGISTRATION = "/userRegistration",
  ADMIN_FLOW_REGISTRATION = "/adminRegistration",
  NEW_USERS_REGISTRATION = "getRegistrationApplicationStatus?",
  GET_USERS_BY_USER_ROLE = "getDataFromUsertype",
  GET_USER_INFO_BY_ID = "getUserInfo",
  GET_USER_PROFILE = "getUserProfile",
  ATTACH_FILES_TO_STUDENT_REGISTER_APPLICATION = "attachFilesToStudentRegisterApplication",
  GET_FILE_URL_BY_EMAIL_AND_FILE_NAME = "getFilesByEmailAndFilename",
  GET_AVAILABLE_INSTITUTION = "getInstitutionNamesForDropDown",
  GET_DASHBOARD = "getDashboard",
  GET_STUDENTS_UNDER_INSTITUTION = "getStudentDataUnderInstitution",

  // Payment
  PAYMENT_ORDER = "paymentOrder",
  PAYMENT_VERIFY = "paymentVerify",

  // update user profile
  UPDATE_STUDENT_PROFILE = "updateStudentProfile",
  UPDATE_MENTOR_PROFILE = "updateMentorProfile",
  UPDATE_DONOR_PROFILE = "updateDonorProfile",
  UPDATE_EDUCATIONAL_INSTITUTION_PROFILE = "updateInstitutionProfile",
  UPDATE_FINANCIAL_INSTITUTION_PROFILE = "updateFinancialInstitutionProfile",

  // scholarships
  // SCH_NEW_SCHOLARSHIP_REGISTRATION = "getScholarshipApplicationStatus?",
  SCH_APPROVE_SCHOLARSHIP_BY_ADMIN = "updateScholarshipApplicationStatusByAdmin",
  SCH_GET_EXISTING_SCHOLARSHIP_BY_VIEW_TYPE = "getScholarshipApplicationStatus",
  SCH_GET_SCHOLARSHIP_APPLICATIONS_UNDER_DONAR = "getStudentScholarshipApplicationStatusUnderDonor",
  SCH_CREATE_SCH_BY_DONOR = "creatScholarshipByDonor",
  SCH_GET_NEW_SCH_PRODUCTS = "getNewScholarshipsToApprove",
  SCH_UPDATE_NEW_SCH_PRODUCTS_BY_ADMIN = "updateScholarshipProductStatusByAdmin",
  SCH_GET_AVAILABLE_SCHOLARSHIPS_FOR_STUDENTS = "getAvailableScholarships",
  SCH_GET_AVAILABLE_DONOR_TYPES = "getDonorTypes",
  SCH_SUBMIT_SCHOLARSHIP = "scholarshipApplications",
  SCH_GET_SCHOLARSHIP_INFO_OF_USER = "getScholarshipInformationOfUser",
  SCH_GET_SCHOLARSHIP_UNDER_INSTITUTION = "getScholarshipDeatilsUnderInstitution",

  // topic
  TP_CREATE_TOPIC_BY_ADMIN = "creatDiscussionTopicByAdmin",
  TP_GET_ALL_TOPICS = "getDiscussionTopics",
  TP_GET_MESSAGES_BY_ID = "getDiscussionTopicsById",
  TP_SEND_MESSAGE_TO_FORUM = "sendMessageToDiscussion",

  // chats
  MSG_GET_ALL_CHATS = "getAllChats",
  MSG_GET_ALL_MENTORS = "getMentorList",
  MSG_GET_ALL_MESSAGES_BY_EMAIL_ID = "getAllMessagesByEmailId",
  MSG_SEND_MESSAGE_TO_FORUM = "chatBoxSendMessage",
  MSG_GET_UNSENT_MESSAGES = "getUnsentMessages",

  //loans
  LN_NEW_LOAN_REGISTRATION = "getLoanApplicationStatus?",
  LN_GET_NEW_LOANS = "getNewLoansToApprove",
  LN_APPROVE_LOAN_BY_ADMIN = "updateLoanApplicationStatusByAdmin",
  LN_CREATE_LOAN_BY_FINANCE_INST = "createLoanApplicationByfinancialInstitution",
  LN_UPDATE_NEW_LOAN_PRODUCTS_BY_ADMIN = "updateLoanProductStatusByAdmin",
  LN_GET_AVAILABLE_LOANS = "getAvailableloans",
  LN_SUBMIT_LOAN_APPLICATION = "loanApplications",
  LN_GET_LOAN_INFO_OF_USER = "getLoanInformationOfUser",
  LN_GET_STUDENTS_APPLI_UNDER_FINANCE_INSTI = "getStudentLoanApplicationStatusUnderFinancial",

  ATTACH_PRODUCT_FILES = "attachFilesToProuduct",
  GET_PRODUCT_FILES = "getProductFiles",
}

export enum Messages {
  CHOOSE_CHAT = "Please choose a conversation",
}

export enum ApprovalTypes {
  NEW = "new",
  APPROVE = "approve",
  REJECT = "reject",
  HOLD = "hold",
}
