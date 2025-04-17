import { Modal } from "antd";
import ApplyLoanForm from "components/forms/ApplyLoanForm";

type prop = {
  showModal: boolean;
  setShowModal: Function;
  data: any;
};

const ShowLoanModal = ({ showModal, setShowModal, data }: prop) => {
  return (
    <div>
      <Modal
        open={showModal}
        title="Scholarship Details"
        onCancel={() => {
          setShowModal(false);
        }}
        footer={null}
        width={700}
      >
        <ApplyLoanForm isViewMode={true} formData={data} />
      </Modal>
    </div>
  );
};
export default ShowLoanModal;
