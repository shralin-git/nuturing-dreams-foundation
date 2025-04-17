import React, { useContext, useEffect, useRef, useState } from "react";
import {
  getFirstLetters,
  getTimeAgo,
  sendNotification,
} from "../../../../utils/helperMethods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Modal, Spin } from "antd";
import { EndPoints, UserRole } from "../../../../utils/enums";
import { AuthDataContext } from "../../../../context/Auth";
import ForumMessages from "./ForumMessages";
import dayjs from "dayjs";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

const Forum = () => {
  const containerRef = useRef<any>(null);
  const topicsRef = useRef<any>(null);
  const [topicContainerHeight, setTopicContainerHeight] = useState(500);
  const { userRole } = useContext(AuthDataContext);
  const [selectedTopic, setSelectedTopic] = useState<any>();
  const [openAddTopicModal, setOpenAddTopicModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  useEffect(() => {
    if (topicsRef.current && containerRef.current) {
      const topicTop = topicsRef.current?.getBoundingClientRect().top + 64;
      const containerHeight =
        containerRef.current?.getBoundingClientRect().height;
      setTopicContainerHeight(containerHeight - topicTop);
    }
  }, [topicsRef, containerRef]);

  const {
    isLoading,
    error,
    data: forumDetails,
  } = useQuery<any, any>({
    queryKey: ["forum"],
    queryFn: async () => await axiosPrivate.get(EndPoints.TP_GET_ALL_TOPICS),
    refetchInterval: 60000,
  });

  const { isPending, mutate: triggerAddTopic } = useMutation({
    mutationFn: (studentRegistrationData: any) => {
      return axiosPrivate.post(
        EndPoints.TP_CREATE_TOPIC_BY_ADMIN,
        studentRegistrationData
      );
    },
    onError: (err) => {
      console.log("err ", err);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["forum"],
      });
      sendNotification("success", res.data?.message);
      form.resetFields();
      setOpenAddTopicModal(false);
    },
  });

  const onFinish = (values: any) => {
    const addTopicData = {
      ...values,
      startEpoch: dayjs(values.startEpoch).unix(),
      endEpoch: dayjs(values.endEpoch).unix(),
    };
    triggerAddTopic(addTopicData);
  };
  const renderTopic = () => {
    if (isLoading) {
      return (
        <div
          className="flex justify-center items-center my-auto border rounded "
          style={{ height: "50vh" }}
        >
          <Spin />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center items-center my-auto h-full border rounded">
          !! Failed to Fetch Data. Plese try again.
        </div>
      );
    }
    return (
      <div
        className="overflow-y-scroll h-96 md:px-10"
        style={{ height: topicContainerHeight }}
      >
        {(forumDetails?.data ? [...forumDetails.data].reverse() : []).map(
          (topic: any) => {
            return (
              <div
                className="flex bg-purple-100 rounded-xl p-4 xs:p-1 mb-2 cursor-pointer "
                key={topic.title}
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="mr-2 bg-mainFont text-white flex  size-16 items-center justify-center rounded-full border-2 border-solid overflow-hidden">
                  {getFirstLetters(topic.title)}
                </div>
                <div className="flex flex-1 flex-col items-start text-fuchsia-900 justify-between">
                  <div className="bold pt-4 text-xl">{topic.title}</div>
                  <div className=" flex  items-center justify-between gap-4 text-xs w-full pr-4  h-6">
                    <span>{getTimeAgo(topic.createdAt)}</span>
                    {topic.isExpired && (
                      <span className="ml-2 py-1  px-2.5  bg-gray-600 text-white rounded-xl">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    );
  };

  return (
    <div>
      {selectedTopic ? (
        <ForumMessages
          topic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      ) : (
        <div className="h-full" ref={containerRef}>
          <div>
            <div className="  flex justify-between border-b-2 border-black p-2">
              <span className="font-bold md:text-2xl  ">Discussion Forum</span>
              {userRole === UserRole.ADMIN && (
                <Button
                  type="primary"
                  onClick={() => {
                    setOpenAddTopicModal(true);
                  }}
                  className="bg-mainFont hover:!bg-mainFontHover"
                >
                  Add Topic
                </Button>
              )}
            </div>
            <div ref={topicsRef} className=" my-4 w-full text-center">
              <span className="m-auto   text-xl font-bold">Topics</span>
            </div>
            <div style={{ height: "calc(100vh - 175px)" }}>{renderTopic()}</div>
          </div>
        </div>
      )}
      <Modal
        open={openAddTopicModal}
        title="Add topic"
        onCancel={() => {
          setOpenAddTopicModal(false);
        }}
        footer={null}
      >
        <Form className="max-w-2xl mt-4 " onFinish={onFinish} form={form}>
          <div className="basis-full flex w-full gap-3">
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Name Required!" }]}
            >
              <Input placeholder="Topic Name" />
            </Form.Item>
          </div>

          <div className="basis-full flex w-full gap-3 justify-between items-center">
            <Form.Item
              name="startEpoch"
              rules={[{ required: true, message: "Start Date is Required" }]}
            >
              <DatePicker placeholder="Start Date" />
            </Form.Item>
            <Form.Item
              name="endEpoch"
              rules={[{ required: true, message: "End Date is Required" }]}
            >
              <DatePicker placeholder="End Date" />
            </Form.Item>
          </div>
          <div className="text-black flex justify-end gap-2  ">
            <Button
              type="primary"
              htmlType="button"
              className={` border-mainFont hover:!bg-mainFontHover text-mainFont`}
              loading={false}
              onClick={() => setOpenAddTopicModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={` bg-mainFont hover:!bg-mainFontHover`}
              loading={isPending}
            >
              Add Topic
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Forum;
