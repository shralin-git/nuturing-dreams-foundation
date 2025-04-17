import styled from "@emotion/styled";
import { Modal, Select } from "antd";
import tw from "twin.macro";

export const CustomSelect = styled(Select)`
  ${tw`border border-mainFont rounded text-[13px] `}
  .ant-select-selector {
    height: 100% !important;
    display: flex;
    align-items: center;
    box-shadow: none !important;
    border: none !important;
  }
  .ant-select-arrow {
    ${tw`text-mainFont`}
  }
`;

export const CustomModal = styled(Modal)`
  .ant-modal-header {
    ${tw`bg-mainFont`}
  }
  .ant-modal-title {
    ${tw`text-white`}
  }

  .ant-modal-close-x span svg {
    fill: white;
  }

  .ant-modal-body {
    ${tw`p-0 mt-5`}
  }
`;
