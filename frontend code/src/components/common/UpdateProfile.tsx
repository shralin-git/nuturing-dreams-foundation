import { getUserNameFromLS, getUserRoleFromLS } from "auth/localAuth";
import DonorForm from "components/forms/DonorForm";
import EducationalInstitutionForm from "components/forms/EducationalInstitutionForm";
import FinancialInstitutionForm from "components/forms/FinancialInstitutionForm";
import MentorForm from "components/forms/MentorForm";
import StudentForm from "components/forms/StudentForm";
import { UserRole } from "utils/enums";
import { sendNotification } from "utils/helperMethods";

type props = {
  setSelectedSettings: Function;
};
const UpdateProfile = ({ setSelectedSettings }: props) => {
  const userRole = getUserRoleFromLS();
  const emailId = getUserNameFromLS();

  const onSuccessCallBack = (res: any) => {
    setSelectedSettings("");
    sendNotification("success", "Profile updated successfully");
  };

  const renderContent = () => {
    switch (userRole) {
      case UserRole.STUDENT:
        return (
          <StudentForm
            isEditMode={true}
            emailId={emailId}
            onSuccessCallBack={onSuccessCallBack}
          />
        );
      case UserRole.MENTOR:
        return (
          <MentorForm
            isEditMode={true}
            emailId={emailId}
            onSuccessCallBack={onSuccessCallBack}
          />
        );
      case UserRole.DONOR:
        return (
          <DonorForm
            isEditMode={true}
            emailId={emailId}
            onSuccessCallBack={onSuccessCallBack}
          />
        );
      case UserRole.EDUCATIONAL_INSTITUTION:
        return (
          <EducationalInstitutionForm
            isEditMode={true}
            emailId={emailId}
            onSuccessCallBack={onSuccessCallBack}
          />
        );
      case UserRole.FINANCIAL_INSTITUTION:
        return (
          <FinancialInstitutionForm
            isEditMode={true}
            emailId={emailId}
            onSuccessCallBack={onSuccessCallBack}
          />
        );

      default:
        break;
    }
  };
  return (
    <div className=" flex flex-col">
      <div className="text-center font-bold text-xl mb-2">Update Profile</div>
      {renderContent()}
    </div>
  );
};

export default UpdateProfile;
