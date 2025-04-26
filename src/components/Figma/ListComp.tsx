import React from "react";

interface ListCompProps {
  className?: string;
  property1?: string;
  epArrowUpBold?: string;
}

export const ListComp: React.FC<ListCompProps> = ({
    className = "",
    property1 = "default",
    epArrowUpBold = "",
  }) => {
    return (
      <div className={`w-[60px] h-[30px] relative ${className}`}>
        <select className="w-full h-full bg-white border border-gray-300 rounded px-1 text-center appearance-none">
          <option value="yes">Yes</option>
          <option value="no">No</option>
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