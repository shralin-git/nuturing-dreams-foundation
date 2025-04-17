import React, { useContext } from "react";
import { Spin } from "antd";
import { UserRole } from "utils/enums";
import { AuthDataContext } from "context/Auth";
import { CustomSelect } from "components/common/CustomSelect";
import { getFirstLetters } from "utils/helperMethods";

const ChatsContainer = (props: any) => {
  const { chats, selectedEmailId, setSelectedEmailId, loading, mentors } =
    props;
  const { userRole } = useContext(AuthDataContext);
  return (
    <div
      className={`${
        selectedEmailId ? "hidden md:block" : ""
      } w-full md:basis-1/3 border-grey-400 border-r  `}
    >
      <div className="px-2">
        <h1 className=" flex border-black  px-2 h-16 text-xl font-bold justify-start items-center ">
          Chats
        </h1>
        {userRole === UserRole.STUDENT && (
          <CustomSelect
            placeholder="Search For a Mentor"
            showSearch
            className="w-full border mb-1"
            value={mentors?.data?.filter(
              (i: any) => i.value === selectedEmailId
            )}
            options={mentors?.data?.map((mentor: any) => {
              return {
                label: mentor.firstName + " " + mentor.lastName,
                value: mentor.email,
              };
            })}
            onChange={(val: any, item: any) => {
              setSelectedEmailId(val);
            }}
          />
        )}
      </div>

      <div
        style={{ height: "calc(100vh - 176px)" }}
        className="overflow-y-scroll pr-1"
      >
        {loading ? (
          <div className=" flex justify-center items-center h-full">
            <Spin />
          </div>
        ) : (
          <>
            {chats?.map((chat: any) => {
              return (
                <div
                  className={` rounded  h-20 flex items-center gap-2 p-1 px-4 hover:bg-gray-200 cursor-pointer ${
                    chat.email === selectedEmailId ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    setSelectedEmailId(chat.email);
                  }}
                >
                  <span className="flex items-center justify-center size-12 rounded-full bg-mainFont text-white">
                    {getFirstLetters(chat?.firstName + " " + chat?.lastName)}
                  </span>
                  <div className=" flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                      <span>{chat?.firstName + " " + chat?.lastName}</span>
                    </div>
                    <span className="text-xs">
                      {userRole === UserRole.STUDENT
                        ? chat?.specialization
                        : chat?.institution}
                    </span>
                  </div>
                  {chat?.count !== 0 && (
                    <div className="flex size-8 rounded-full items-center justify-center bg-white text-mainFont">
                      {chat.count}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatsContainer;
