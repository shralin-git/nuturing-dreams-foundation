import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { FaBars } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

const CommonNavBar = () => {
  const params = useLocation();
  const isRegisterPage = params?.pathname?.toLocaleLowerCase() === "/register";
  const isResetPage = params?.pathname === "/reset";
  const isLoginPage = params?.pathname?.toLocaleLowerCase() === "/login";
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className="flex relative h-16 justify-between items-center text-white font-bold border-b md:border-none border-gray-600 bg-gradient-to-b from-mainFont to-black "
      // style={{ background: "linear-gradient(to bottom, #733c71, #000000)" }}
    >
      <div className=" flex gap-4 items-center ">
        <div className="flex ml-5 items-center">
          <span className="rounded-full overflow-hidden size-12 flex items-center justify-center border-solid  mr-2 cursor-pointer">
            <img src={"./images/logo.png"} alt="NDF" />
          </span>
          <Link to={"/"}>Nurturing Dreams Foundation</Link>
          <span className=" hidden md:inline-block mx-10 text-gray-700">|</span>
        </div>
        <div className="hidden md:flex justify-between gap-10 mr-2 ">
          <span>
            <Link to={"/"}>Home</Link>
          </span>
          <span>About Us</span>
          {/* <span>Our Blog</span> */}
          <span>
            <Link to={"/contactUs"}>Contact Us </Link>
          </span>
        </div>
      </div>
      <div className="hidden md:block">
        {!isResetPage && (
          <div className="flex flex-row   mr-4   gap-4 ">
            {!isLoginPage && (
              <Link
                to={"/Login"}
                className="mr-4 flex items-center gap-1 border p-2 rounded border-gray-500 hover:bg-mainFontHover"
              >
                <UserOutlined />
                Login
              </Link>
            )}
            {!isRegisterPage && (
              <Link
                to={"/Register"}
                className="flex items-center gap-1 border p-2 rounded border-gray-500 hover:bg-mainFontHover"
              >
                <UserAddOutlined />
                New Register
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="mr-2 md:hidden " onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? (
          <FaBars size={25} style={{ color: "white" }} />
        ) : (
          <RxCross1 size={25} style={{ color: "white" }} />
        )}
      </div>

      {!collapsed && (
        <div
          className="z-50 md:hidden absolute top-16  w-full mobile-menu  transition duration-500 h-screen  text-white bg-gradient-to-t from-mainFont to-black"
          // style={{ background: "linear-gradient(to top, #733c71, #000000)" }}
        >
          <div className=" block  py-6 px-4 text-lg  hover:font-bold text-center ">
            <Link to={"/"}> About Us</Link>
          </div>
          {/* <div className=" block  py-6 px-4 text-lg hover:font-bold text-center ">
            Our Blog
          </div> */}
          <div className=" block  py-6 px-4 text-lg hover:font-bold text-center ">
            <Link to={"/contactUs"}>Contact Us </Link>
          </div>
          <Link
            to={"/login"}
            className=" flex justify-center gap-2 py-6 px-4 text-lg hover:font-bold text-center "
          >
            <UserOutlined />
            Login
          </Link>
          <Link
            to={"/register"}
            className=" flex justify-center gap-2 py-6 px-4 text-lg hover:font-bold text-center "
          >
            <UserAddOutlined />
            New Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default CommonNavBar;
