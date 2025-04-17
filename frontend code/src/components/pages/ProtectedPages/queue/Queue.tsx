import React, { useEffect, useState } from "react";
import { Radio } from "antd";
import { config } from "../../../../config/appConfig";
import NewUsersRegistration from "./NewUsersRegistration";
import NewScholarshipRegistration from "./NewScholarshipRegistration";
import NewScholarshipProductRegistration from "./NewScholarshipProductRegistration";
import RegistrationDetailsModal from "../../../modals/RegistrationDetailsModal";
import NewLoanRegistration from "./NewLoanRegistration";
import NewLoanProductRegistration from "./NewLoanProductRegistration";

const Queue = () => {
  const { adminRegistrationRadioButton } = config;
  const [showModal, setShowModal] = useState(false);

  const [selectedType, setSelectedType] = useState(
    adminRegistrationRadioButton[0].value
  );

  const [selectedShowDetails, setSlectedShowDetails] = useState<any>(null);

  const renderContent = () => {
    switch (selectedType) {
      case adminRegistrationRadioButton[0].value:
      default:
        return (
          <NewUsersRegistration setSlectedShowDetails={setSlectedShowDetails} />
        );
      case adminRegistrationRadioButton[1].value:
        return <NewScholarshipRegistration />;
      case adminRegistrationRadioButton[2].value:
        return <NewScholarshipProductRegistration />;
      case adminRegistrationRadioButton[3].value:
        return <NewLoanRegistration />;
      case adminRegistrationRadioButton[4].value:
        return <NewLoanProductRegistration />;
    }
  };

  useEffect(() => {
    if (selectedShowDetails) {
      setShowModal(true);
    }
  }, [selectedShowDetails]);

  return (
    <div className="w-full">
      <div className=" border-b-2 border-black p-2">
        <span className="font-bold text-2xl   mb-4 mr-4 pl-4">
          Registration:
        </span>

        <Radio.Group
          onChange={(e) => setSelectedType(e.target.value)}
          value={selectedType}
          className="  p-1 rounded mr-2 border-mainFont pl-4 bg-gray-300"
        >
          {/* <Radio value={"users"}>Users</Radio>
        <Radio value={"scholarship"}>Scholarships</Radio> */}
          {adminRegistrationRadioButton?.map((rad: any) => (
            <Radio
              value={rad.value}
              checked={selectedType === rad.value}
              key={rad.value}
            >
              {rad.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      {renderContent()}

      <RegistrationDetailsModal
        selectedShowDetails={selectedShowDetails}
        setSelectedShowDetails={setSlectedShowDetails}
        open={showModal}
        setOpen={setShowModal}
        isNewUserMode={true}
      />
    </div>
  );
};

export default Queue;
