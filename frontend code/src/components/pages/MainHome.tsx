import React from "react";
import { Link } from "react-router-dom";
import CommonNavBar from "../common/CommonNavBar";

const MainHome = () => {
  return (
    <div className="flex flex-col h-screen">
      <CommonNavBar />
      <div
        className="grow flex justify-start items-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url(./images/bg-image.png)",
        }}
      >
        <div className="flex justify-center items-start md:items-center flex-col w-full md:w-1/2 px-2 md:ml-4 ">
          <div className="mb-8 font-bold text-center text-3xl md:text-5xl text-white">
            Give a helping hand to those who need it!
          </div>
          <Link
            to={"/register"}
            className="bg-gray-200 px-4 py-2 font-bold border rounded-lg mt-2  w-28 text-center"
          >
            Join Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainHome;
