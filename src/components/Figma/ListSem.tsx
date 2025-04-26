import React from "react";

interface ListSemProps {
  className?: string;
  property1?: string;
  epArrowUpBold?: string;
}

export const ListSem: React.FC<ListSemProps> = ({
  className = "",
  property1 = "default",
  epArrowUpBold = "",
}) => {
  return (
    <div className={`w-[130px] h-[30px] relative ${className}`}>
      <select className="w-full h-full bg-white border border-gray-300 rounded px-2 appearance-none">
        <option value="First">First</option>
        <option value="Second">Second</option>
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