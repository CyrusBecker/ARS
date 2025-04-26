import React from "react";

interface ConcreteComponentNodeProps {
  className?: string;
}

export const ConcreteComponentNode: React.FC<ConcreteComponentNodeProps> = ({ className = "" }) => {
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