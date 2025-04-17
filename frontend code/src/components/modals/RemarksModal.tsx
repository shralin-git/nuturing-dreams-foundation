import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";
import { hoverButtonClass } from "utils/constants";

type props = {
  setOpenRemarksModal: Function;
  openRemarksModal: boolean;
  approvalProps: any;
  onSubmitRemarksCallBack: Function;
};

const RemarksModal = ({
  setOpenRemarksModal,
  openRemarksModal,
  approvalProps,
  onSubmitRemarksCallBack,
}: props) => {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({ remarks: "" });
  }, [openRemarksModal, form]);

  const onFinish = (values: any) => {
    onSubmitRemarksCallBack({ ...approvalProps, ...values });
    setOpenRemarksModal(false);
  };

  const renderModal = () => {
    return (
      <Form
        form={form}
        name="wrap"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
      >
        <Form.Item name="remarks">
          <Input placeholder="Remarks" />
        </Form.Item>
        <Form.Item className="flex justify-end ">
          <Button
            type="primary"
            htmlType="button"
            className={`${hoverButtonClass} bg-gray-500`}
            onClick={() => {
              setOpenRemarksModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className={`${hoverButtonClass} ml-2`}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div>
      <Modal
        open={openRemarksModal}
        title={`Remarks for ${approvalProps?.status}`}
        onCancel={() => {
          setOpenRemarksModal(false);
        }}
        footer={null}
      >
        {renderModal()}
      </Modal>
    </div>
  );
};

export default RemarksModal;
