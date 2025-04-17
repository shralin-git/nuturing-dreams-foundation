import React, { useContext, useEffect, useState } from "react";
import { CustomSelect } from "../../common/CustomSelect";
import { config } from "../../../config/appConfig";
import NewUsersRegistration from "./queue/NewUsersRegistration";
import RegistrationDetailsModal from "../../modals/RegistrationDetailsModal";
import Register from "../registration/Register";
import { hoverButtonClass } from "utils/constants";
import { AuthDataContext } from "context/Auth";
import { UserRole } from "utils/enums";
import { RegistrationDataContext } from "context/RegistraionContext";

const Users = () => {
  const [selectedUserType, setSelectedUserType] = useState<any>(
    config.users[0]
  );
  const { userRole } = useContext(AuthDataContext);
  const { setIsAdminFlow, showAddUsers, setShowAddUsers } = useContext(
    RegistrationDataContext
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedShowDetails, setSlectedShowDetails] = useState<any>(null);

  useEffect(() => {
    if (selectedShowDetails) {
      setShowModal(true);
    }
  }, [selectedShowDetails]);

  useEffect(() => {
    if (userRole === UserRole.ADMIN) {
      setIsAdminFlow(true);
    }
  }, [userRole]);

  return (
    <>
      {showAddUsers ? (
        <Register resetAddUsers={() => setShowAddUsers(false)} />
      ) : (
        <div>
          <div className="flex justify-between border-b-2 border-black p-2 items-center  px-4">
            <div>
              <span className="font-bold text-2xl    mb-4 mr-4  ">
                Show All
              </span>
              {[
                UserRole.ADMIN.toString(),
                UserRole.FINANCIAL_INSTITUTION.toString(),
              ].includes(userRole) && (
                <CustomSelect
                  // suffixIcon={<}
                  className="w-48 border"
                  value={selectedUserType}
                  options={config.users}
                  onChange={(val: any, item: any) => {
                    setSelectedUserType(item);
                  }}
                />
              )}
            </div>
            {userRole === UserRole.ADMIN && (
              <button
                className={`${hoverButtonClass} `}
                onClick={() => setShowAddUsers(true)}
              >
                Add Users
              </button>
            )}
          </div>
          <NewUsersRegistration
            setSlectedShowDetails={setSlectedShowDetails}
            hideActions={true}
            userType={selectedUserType.value}
          />
          {/* MODAL */}
          <RegistrationDetailsModal
            selectedShowDetails={selectedShowDetails}
            setSelectedShowDetails={setSlectedShowDetails}
            open={showModal}
            setOpen={setShowModal}
          />
        </div>
      )}
    </>
  );
};

export default Users;
