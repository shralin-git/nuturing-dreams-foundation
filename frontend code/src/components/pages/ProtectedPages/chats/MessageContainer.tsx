import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button, Input, Spin } from "antd";

import useAxiosPrivate from "hooks/useAxiosPrivate";
import { getUserNameFromLS } from "auth/localAuth";
import { EndPoints } from "utils/enums";
import {
  capitalizeWords,
  getFirstLetters,
  getTimeAgo,
} from "utils/helperMethods";
import { IoMdSend } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

const MessageContainer = (props: any) => {
  const { selectedEmailId, setSelectedEmailId, name = "" } = props;
  const messagesEndRef = useRef<any>(null);
  const [message, setMessage] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const inputRef = useRef<any>(null);

  const { isLoading, data: messageData } = useQuery<any, any>({
    queryKey: ["messages", selectedEmailId],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.MSG_GET_ALL_MESSAGES_BY_EMAIL_ID, {
        params: { email: selectedEmailId },
      }),
    refetchInterval: 10000,
  });

  const {
    isPending: isSendMessagePending,
    // isError,
    // isSuccess,
    mutate: triggerAddMessage,
  } = useMutation({
    mutationFn: (messageDetails: any) => {
      return axiosPrivate.post(
        EndPoints.MSG_SEND_MESSAGE_TO_FORUM,
        messageDetails
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedEmailId],
      });
      setMessage("");
    },
  });

  // enable focus on message input
  inputRef.current?.focus();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messageData?.data]);

  // Group messages by date
  const groupedMessages = groupMessagesByDate(
    messageData?.data ? [...messageData?.data].reverse() : []
  );

  //  reversing group order by date
  groupedMessages.reverse();

  const onHandleSubmit = (e: any) => {
    e.preventDefault();
    // api call
    triggerAddMessage({ message, receiverEmail: selectedEmailId });
    // triggerAddMessage()
  };

  const isMessageTyped = message?.trim()?.length > 0;

  return (
    <div className=" w-full md:basis-2/3  bg-white ">
      <div className="  h-16 border-b bg-gray-100 flex items-center pl-2 md:pl-8 gap-1 md:gap-4">
        <IoArrowBack
          size={30}
          className="cursor-pointer"
          onClick={() => setSelectedEmailId("")}
        />
        <div className="size-12 flex items-center justify-center bg-mainFont rounded-full text-white ">
          {getFirstLetters(name)}
        </div>
        <span>{capitalizeWords(name)}</span>
      </div>
      <div
        style={{ height: "calc(100vh - 194px)" }}
        className="overflow-y-scroll px-2 md:px-24"
      >
        {isLoading ? (
          <div className=" flex justify-center items-center h-full">
            <Spin />
          </div>
        ) : (
          <>
            {groupedMessages?.map((group: any, index: any) => (
              <div key={index} className="mb-4">
                <div className="  font-xs text-gray-700 text-center mb-2">
                  {group?.date}
                </div>
                <div className="  flex flex-col-reverse ">
                  {group?.messages?.map((message: any, index: any) => {
                    return (
                      <MessageItem
                        key={index}
                        message={message}
                        isSentByMe={message?.from === getUserNameFromLS()}
                        sentBy={message?.from}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="h-16 border-t bg-gray-100 flex ">
        <form
          className="flex gap-2 justify-center items-center w-full"
          onSubmit={onHandleSubmit}
        >
          <Input
            className="w-3/4 "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSendMessagePending}
            ref={inputRef}
            placeholder="Type a message..."
          />
          <Button
            className={`bg-mainFont rounded  text-white px-2 py-1   ${
              isMessageTyped ? "hover:!bg-mainFontHover" : ""
            }`}
            type="primary"
            htmlType="submit"
            loading={isSendMessagePending}
            disabled={!isMessageTyped}
          >
            {/* Send Message */}
            <IoMdSend />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageContainer;

const MessageItem = ({ message, isSentByMe, sentBy }: any) => {
  const messageTime = getTimeAgo(message?.createdAt?._seconds - 1);

  return (
    <div
      className={`flex mb-2 ${isSentByMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`rounded-lg relative p-2.5 pb-4 w-4/5  ${
          isSentByMe ? "bg-gray-200" : "bg-red-100"
        }`}
      >
        {message.message}
        <div className=" text-xs  absolute right-2 bottom-2">{messageTime}</div>
      </div>
    </div>
  );
};

// Function to group messages by date
const groupMessagesByDate = (messages: any) => {
  const groupedMessages: any = [];
  let currentDate: any = null;

  messages?.forEach((message: any) => {
    const messageDate = new Date(
      message?.createdAt._seconds * 1000
    ).toDateString();

    // If message date is different from current date, create a new group
    if (messageDate !== currentDate) {
      groupedMessages.push({
        date: messageDate,
        messages: [message],
      });
      currentDate = messageDate;
    } else {
      // Otherwise, add message to existing group
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });

  return groupedMessages;
};
