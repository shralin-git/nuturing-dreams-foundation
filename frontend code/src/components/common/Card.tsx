import React from "react";

type cardProps = {
  header: string;
  count: number;
};

const NurturingCard = ({ header, count }: cardProps) => {
  return (
    <div
      className="flex flex-col rounded h-36  w-64 m-8 bg-gradient-to-r from-mainFont to-cardColor"
      // style={{ background: "linear-gradient(to right, #773970, #8f758f)" }}
    >
      <div className="text-xl font-bold text-white px-2 ml-2">{header}</div>
      <div className="text-4xl font-bold text-white px-2 text-center mt-4">
        {count}
      </div>
    </div>
  );
};

export default NurturingCard;
