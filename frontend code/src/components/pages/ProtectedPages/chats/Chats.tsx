import { useQuery } from "@tanstack/react-query";
import React, { useContext, useMemo, useState } from "react";
import ChatsContainer from "./ChatsContainer";
import MessageContainer from "./MessageContainer";
import { EndPoints, Messages, UserRole } from "../../../../utils/enums";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { AuthDataContext } from "context/Auth";

const Chats = () => {
  const axiosPrivate = useAxiosPrivate();
  const { userRole } = useContext(AuthDataContext);

  const [selectedEmailId, setSelectedEmailId] = useState("");

  const { data: mentors } = useQuery({
    queryKey: ["get-mentors"],
    queryFn: async () => await axiosPrivate.get(EndPoints.MSG_GET_ALL_MENTORS),
    enabled: userRole === UserRole.STUDENT,
  });

  const { isLoading, data: chatsData } = useQuery<any, any>({
    queryKey: ["chats"],
    queryFn: async () => await axiosPrivate.get(EndPoints.MSG_GET_ALL_CHATS),
    refetchInterval: 30000,
  });

  const selectedChat = useMemo(() => {
    let res: any = chatsData?.data?.find(
      (i: any) => i.email === selectedEmailId
    );

    if (!res) {
      res = mentors?.data?.find((i: any) => i.email === selectedEmailId);
    }
    return res;
  }, [chatsData?.data, selectedEmailId, mentors?.data]);

  return (
    <div className="flex">
      <ChatsContainer
        chats={chatsData?.data}
        loading={isLoading}
        selectedEmailId={selectedEmailId}
        setSelectedEmailId={setSelectedEmailId}
        mentors={mentors}
      />
      {selectedEmailId ? (
        <MessageContainer
          selectedEmailId={selectedEmailId}
          setSelectedEmailId={setSelectedEmailId}
          name={selectedChat?.firstName + " " + selectedChat?.lastName}
        />
      ) : (
        <div
          className={` hidden md:flex items-center justify-center w-full md:basis-2/3   `}
        >
          {Messages.CHOOSE_CHAT}
        </div>
      )}
    </div>
  );
};

export default Chats;
