import { Modal } from "antd";
import ApplyScholarshipForm from "components/forms/ApplyScholarshipForm";
import React from "react";

const ApplyScholarShipModal = ({
  applyScholarshipModal,
  setApplyScholarshipModal,
}: any) => {
  return (
    <div>
      <Modal
        open={applyScholarshipModal}
        onCancel={() => {
          setApplyScholarshipModal(false);
        }}
        footer={null}
        width={700}
      >
        <ApplyScholarshipForm
          setApplyScholarshipModal={setApplyScholarshipModal}
        />
      </Modal>
    </div>
  );
};

export default ApplyScholarShipModal;
