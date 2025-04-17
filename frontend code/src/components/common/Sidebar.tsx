import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { IoPeopleSharp, IoSchoolSharp } from "react-icons/io5";
import { RiMailAddFill } from "react-icons/ri";
import { GiDiscussion } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { FaAngleDoubleLeft, FaBars } from "react-icons/fa";
import { AuthDataContext } from "../../context/Auth";
import { RoutesEnum, roleRoutesMapping } from "../../utils/enums";
import { GrNewWindow } from "react-icons/gr";
import { BsBank2 } from "react-icons/bs";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { userRole } = useContext(AuthDataContext);

  const { pathname } = useLocation();

  const selectedRoute = pathname.split("/")[1];

  const enableLinksbyUserRole = () => {
    const enabledLinks: Array<string> = roleRoutesMapping[userRole];
    return (
      <>
        {enabledLinks.map((item: string) => {
          const routeName: string = item;
          return (
            <Link
              to={`/${routeName}`}
              className={`h-12  p-4 text-white decoration-none flex items-center  hover:bg-gray-600  ${
                selectedRoute.toLocaleLowerCase() === routeName
                  ? "bg-gray-600  "
                  : ""
              }`}
              key={routeName}
              // onClick={() => setCollapsed(false)} // it set collapsed state to false
            >
              {getIconsByName(routeName)}

              {!collapsed && (
                <div className="text-sm pl-2 ">
                  {routeName[0].toLocaleUpperCase() + routeName.slice(1)}
                </div>
              )}
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <aside
      className={` bg-black cursor-pointer ${
        collapsed ? "w-14" : "w-40"
      } bg-gradient-to-t from-mainFont to-black `}
      // style={{ background: "linear-gradient(to top, #733c71, #000000)" }}
    >
      <div
        className="sidebar-toggle  flex justify-end pr-4 pt-4 h-16 bg-gradient-to-b from-mainFont to-black"
        // style={{ background: "linear-gradient(to bottom, #733c71, #000000)" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <FaBars size={20} style={{ color: "white" }} />
        ) : (
          <FaAngleDoubleLeft size={20} style={{ color: "white" }} />
        )}
      </div>
      <div className=" ">
        <ul className=" list-none p-0">{enableLinksbyUserRole()}</ul>
      </div>
    </aside>
  );
};

export default Sidebar;

const getIconsByName = (name: string) => {
  switch (name) {
    case RoutesEnum.DASHBOARD:
      return <MdDashboard size={20} />;
    case RoutesEnum.QUEUE:
      return <GrNewWindow size={20} />;
    case RoutesEnum.CHATS:
      return <RiMailAddFill size={20} />;
    case RoutesEnum.FORUM:
      return <GiDiscussion size={20} />;
    case RoutesEnum.HOME:
      return <AiFillHome />;
    case RoutesEnum.SETTINGS:
      return <IoMdSettings size={20} />;
    case RoutesEnum.SCHOLARSHIP:
    case RoutesEnum.SCHOLARSHIP_STUDENT:
      return <IoSchoolSharp size={20} />;
    case RoutesEnum.USERS:
      return <IoPeopleSharp size={20} />;
    case RoutesEnum.LOANS:
    case RoutesEnum.LOAN_STUDENT:
      return <BsBank2 size={20} />;

    default:
      return <> </>;
  }
};
