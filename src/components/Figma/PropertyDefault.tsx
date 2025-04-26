import React from "react";

interface PropertyDefaultProps {
  className?: string;
}

export const PropertyDefault: React.FC<PropertyDefaultProps> = ({ className = "" }) => {
  return (
    <div className={`w-[100px] h-[30px] bg-white border border-gray-300 rounded px-2 ${className}`}>
      <input 
        type="text" 
        className="w-full h-full outline-none text-center" 
        placeholder="Year"
      />
    </div>
  );
};