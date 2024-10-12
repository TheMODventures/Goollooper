import React from "react";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="p-2 flex justify-between bg-backGroundColor">
    <h1 className="text-black font-bold text-md">{label}</h1>
    {value}
  </div>
);

export default InfoRow;
