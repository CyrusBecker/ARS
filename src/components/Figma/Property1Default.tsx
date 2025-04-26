import React from "react";

interface Property1DefaultProps {
  className?: string;
}

export const Property1Default: React.FC<Property1DefaultProps> = ({ className = "" }) => {
  return (
    <div className={`w-[40px] h-[30px] bg-white border border-gray-300 rounded px-2 ${className}`}>
      <input 
        type="text" 
        className="w-full h-full outline-none text-center" 
        placeholder="0"
      />
    </div>
  );
};