import React from "react";

interface ListProgramCodeProps {
  className?: string;
  property1?: string;
  epArrowUpBold?: string;
}

export const ListProgramCode: React.FC<ListProgramCodeProps> = ({
  className = "",
  property1 = "default",
  epArrowUpBold = "",
}) => {
  return (
    <div className={`w-[130px] h-[30px] relative ${className}`}>
      <select className="w-full h-full bg-white border border-gray-300 rounded px-2 appearance-none">
        <option value="BSCS">BSCS</option>
        <option value="BSIT">BSIT</option>
        <option value="BSCE">BSCE</option>
      </select>
      {epArrowUpBold && (
        <img
          className="absolute w-4 h-4 top-[7px] right-1 pointer-events-none"
          alt="Arrow"
          src={epArrowUpBold}
        />
      )}
    </div>
  );
};