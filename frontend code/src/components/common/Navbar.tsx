import React, { useContext } from "react";
import { UserOutlined, BellOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { AuthDataContext } from "../../context/Auth";
import { Link } from "react-router-dom";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { EndPoints } from "utils/enums";
import { getDisplayNameFromLs } from "auth/localAuth";

const Navbar: React.FC = () => {
  const { logout } = useContext(AuthDataContext);

  const displayName = getDisplayNameFromLs();

  const axiosPrivate = useAxiosPrivate();
  const { data: notifications } = useQuery<any, any>({
    queryKey: ["notification"],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.MSG_GET_UNSENT_MESSAGES),
    refetchInterval: 30000,
  });

  const content = () => (
    <div className="bg-white min-w-[12rem] rounded-b-lg font-medium font-xs">
      <div className="mb-2 font-bold  text-mainFontHover">{displayName}</div>
      <div
        className="w-full py-1 mt-4   rounded flex justify-center items-center cursor-pointer bg-mainFont"
        onClick={() => logout()}
      >
        <span className="text-white">Logout</span>
      </div>
    </div>
  );
  const notificationContent = () => (
    <div className="bg-white min-w-[12rem] rounded-b-lg font-medium font-xs">
      {notifications?.data?.message !== 0 ? (
        <Link
          to="/chats"
          className="  mb-2 font-bold hover:text-mainFontHover "
        >{`You have ${notifications?.data?.message} new messages..!`}</Link>
      ) : (
        "You have 0 notification..!"
      )}
    </div>
  );

  return (
    <nav className="bg-gray-800 text-white p-4 h-16 flex justify-between items-center bg-gradient-to-b from-mainFont to-black ">
      <div className="flex items-center gap-2">
        <span className="w-10 h-10 rounded-full overflow-hidden  border-white text-black  flex justify-center items-center">
          <img src={"./images/logo.png"} alt="NDF" className="object-fit" />
        </span>

        <span className="font-bold text-sm md:text-lg ">
          Nurturing Dreams Foundation
        </span>
      </div>
      <div className="flex justify-between gap-6 cursor-pointer">
        <span className="relative">
          <Popover
            overlayInnerStyle={{ position: "relative", top: -5 }}
            trigger={"click"}
            showArrow={false}
            placement="bottomRight"
            content={notificationContent}
          >
            <BellOutlined style={{ color: "white" }} size={20} />
            {notifications?.data?.message !== 0 && (
              <span className="absolute size-2 bg-pink-500 rounded-full"></span>
            )}
          </Popover>
        </span>
        <span>
          <Popover
            overlayInnerStyle={{ position: "relative", top: -5 }}
            trigger={"click"}
            showArrow={false}
            placement="bottomRight"
            content={content}
          >
            <UserOutlined size={20} />
          </Popover>
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
