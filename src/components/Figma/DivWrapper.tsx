import React from "react";

interface DivWrapperProps {
  className?: string;
}

export const DivWrapper: React.FC<DivWrapperProps> = ({ className = "" }) => {
  return (
    <div className={`w-[200px] h-[30px] bg-white border border-gray-300 rounded px-2 ${className}`}>
      <input 
        type="text" 
        className="w-full h-full outline-none" 
        placeholder="Course Name"
      />
    </div>
  );
};