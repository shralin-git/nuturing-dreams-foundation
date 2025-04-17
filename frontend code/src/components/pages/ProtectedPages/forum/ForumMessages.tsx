import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  epochToDate,
  getFirstLetters,
  getTimeAgo,
} from "../../../../utils/helperMethods";
import { Button, Input, Spin } from "antd";
import { IoArrowBack } from "react-icons/io5";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { EndPoints } from "../../../../utils/enums";
import { AuthDataContext } from "../../../../context/Auth";
import { IoMdSend } from "react-icons/io";

const ForumMessages = (props: any) => {
  const { userName } = useContext(AuthDataContext);

  const { topic, setSelectedTopic } = props;
  const messagesEndRef = useRef<any>(null);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const inputRef = useRef<any>(null);

  const [message, setMessage] = useState<string>("");

  const {
    isLoading,
    error,
    data: forumMessageData,
  } = useQuery<any, any>({
    queryKey: ["forum-messages", topic?.id],
    queryFn: async () =>
      await axiosPrivate.get(EndPoints.TP_GET_MESSAGES_BY_ID, {
        params: {
          id: topic?.id,
        },
      }),
    refetchInterval: 5000,
  });
  const {
    isPending: isSendMessagePending,
    // isError,
    // isSuccess,
    mutate: triggerAddMessage,
  } = useMutation({
    mutationFn: (messageDetails: any) => {
      return axiosPrivate.post(
        EndPoints.TP_SEND_MESSAGE_TO_FORUM,
        messageDetails,
        {
          params: { id: topic.id },
        }
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["forum-messages", topic?.id],
      });
      setMessage("");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [forumMessageData?.data]);

  // Group messages by date
  const groupedMessages = groupMessagesByDate(
    forumMessageData?.data ? [...forumMessageData.data].reverse() : []
  );

  //  reversing group order by date
  groupedMessages.reverse();

  const onHandleSubmit = (e: any) => {
    e.preventDefault();
    // api call
    triggerAddMessage({ message });
  };

  // enable focus on message input
  inputRef.current?.focus();

  const isMessageTyped = message?.trim()?.length > 0;

  return (
    <div className=" basis-2/3  bg-white ">
      <div className="  h-16 border-b bg-gray-100 flex items-center pl-2 md:pl-8 gap-1 md:gap-4">
        <IoArrowBack
          size={30}
          className="cursor-pointer"
          onClick={() => setSelectedTopic("")}
        />
        <div className="size-12 flex items-center justify-center bg-mainFont rounded-full text-white ml-1 md:ml-5">
          {getFirstLetters(topic?.title)}
        </div>

        <span>{topic.title}</span>
      </div>
      <div
        style={{ height: "calc(100vh - 194px)" }}
        className="overflow-y-scroll px-2 md:px-32"
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
                  {group?.messages?.map((message: any, index: any) => (
                    <MessageItem
                      key={index}
                      message={message}
                      isSentByMe={message.from?.email === userName}
                      senderName={message.from}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="h-16 border-t bg-gray-100 flex ">
        {topic.isExpired ? (
          <span className="m-auto">This Discussion Forum Has Been Expired</span>
        ) : (
          <form
            className="flex gap-2 justify-center items-center w-full"
            onSubmit={onHandleSubmit}
          >
            <Input
              className="w-3/4 "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSendMessagePending}
              placeholder="Type a message..."
              ref={inputRef}
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
        )}
      </div>
    </div>
  );
};

export default ForumMessages;

const MessageItem = ({ message, isSentByMe, senderName }: any) => {
  const messageTime = getTimeAgo(message?.createdAt?._seconds - 1);

  return (
    <div
      className={`flex mb-2 ${isSentByMe ? "justify-end" : "justify-start"}`}
    >
      {isSentByMe ? (
        ""
      ) : (
        <div className="flex items-center justify-center size-12 rounded-full bg-mainFont text-white mr-2">
          {getFirstLetters(senderName.firstName + " " + senderName.lastName)}
        </div>
      )}
      <div
        className={`rounded-lg relative p-2.5 pb-4 w-4/5 flex flex-col ${
          isSentByMe ? "bg-gray-200" : "bg-red-100"
        }`}
      >
        {isSentByMe ? (
          ""
        ) : (
          <span className="text-xs mr-4 text-mainFont font-medium">
            {senderName.firstName + " " + senderName.lastName}
          </span>
        )}
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
    const messageDate = epochToDate(message?.createdAt?._seconds);

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
