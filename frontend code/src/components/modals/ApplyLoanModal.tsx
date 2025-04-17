import { Modal } from "antd";
import ApplyLoanForm from "components/forms/ApplyLoanForm";
import React from "react";

const ApplyLoanModal = ({ applyLoanModal, setApplyLoanModal }: any) => {
  return (
    <div>
      <Modal
        open={applyLoanModal}
        onCancel={() => {
          setApplyLoanModal(false);
        }}
        footer={null}
        width={700}
      >
        <ApplyLoanForm setApplyLoanModal={setApplyLoanModal} />
      </Modal>
    </div>
  );
};

export default ApplyLoanModal;
