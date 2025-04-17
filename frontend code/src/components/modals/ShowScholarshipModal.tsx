import { Modal } from "antd";
import ApplyScholarshipForm from "components/forms/ApplyScholarshipForm";

type prop = {
  showModal: boolean;
  setShowModal: Function;
  data: any;
};

const ShowScholarshipModal = ({ showModal, setShowModal, data }: prop) => {
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
        <ApplyScholarshipForm isViewMode={true} formData={data} />
      </Modal>
    </div>
  );
};

export default ShowScholarshipModal;
