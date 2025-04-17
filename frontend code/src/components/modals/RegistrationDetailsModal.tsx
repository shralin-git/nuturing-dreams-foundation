import React from "react";
import { UserRole } from "../../utils/enums";
import { Modal } from "antd";
import DonorForm from "../forms/DonorForm";
import StudentForm from "../forms/StudentForm";
import MentorForm from "../forms/MentorForm";
import EducationalInstitutionForm from "../forms/EducationalInstitutionForm";
import FinancialInstitutionForm from "../forms/FinancialInstitutionForm";

type props = {
  open: boolean;
  setOpen: Function;
  selectedShowDetails: any;
  setSelectedShowDetails: Function;
  isNewUserMode?: boolean;
};

const RegistrationDetailsModal = (props: props) => {
  const {
    open,
    setOpen,
    selectedShowDetails,
    setSelectedShowDetails,
    isNewUserMode,
  } = props;
  const userRole = selectedShowDetails?.["User Type"]?.toLocaleLowerCase();
  const emailId = selectedShowDetails?.["Email ID"]?.toLocaleLowerCase();

  const renderModal = () => {
    switch (userRole) {
      case UserRole.DONOR:
        return (
          <DonorForm
            isViewMode={true}
            emailId={emailId}
            isNewUserMode={isNewUserMode}
          />
        );
      case UserRole.STUDENT:
        return (
          <StudentForm
            isViewMode={true}
            emailId={emailId}
            isNewUserMode={isNewUserMode}
          />
        );
      case UserRole.MENTOR:
        return (
          <MentorForm
            isViewMode={true}
            emailId={emailId}
            isNewUserMode={isNewUserMode}
          />
        );
      case UserRole.EDUCATIONAL_INSTITUTION:
        return (
          <EducationalInstitutionForm
            isViewMode={true}
            emailId={emailId}
            isNewUserMode={isNewUserMode}
          />
        );
      case UserRole.FINANCIAL_INSTITUTION:
      case "financial institution":
        return (
          <FinancialInstitutionForm
            isViewMode={true}
            emailId={emailId}
            isNewUserMode={isNewUserMode}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Modal
        open={open}
        title="User Details"
        onCancel={() => {
          setOpen(false);
          setSelectedShowDetails(null);
        }}
        footer={null}
      >
        {renderModal()}
      </Modal>
    </>
  );
};

export default RegistrationDetailsModal;
