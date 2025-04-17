import { Spin } from "antd";

const FormLoader = () => {
  return (
    <div className="h-64 m-auto flex items-center justify-center">
      <Spin />
    </div>
  );
};

export default FormLoader;
