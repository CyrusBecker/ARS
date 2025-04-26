import React from "react";

interface ListLevelProps {
  className?: string;
  property1?: string;
  epArrowUpBold?: string;
}

export const ListLevel: React.FC<ListLevelProps> = ({
  className = "",
  property1 = "default",
  epArrowUpBold = "",
}) => {
  return (
    <div className={`w-[120px] h-[30px] relative ${className}`}>
      <select className="w-full h-full bg-white border border-gray-300 rounded px-2 appearance-none">
        <option value="undergraduate">Undergraduate</option>
        <option value="graduate">Graduate</option>
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