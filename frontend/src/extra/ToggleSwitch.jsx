import * as React from "react";

export default function ToggleSwitch(props) {
  const {
    value,
    onChange,
    onClick,
    disabled = false,
    size = "medium",
    color = "blue"
  } = props;

  const sizeClasses = {
    small: "w-8 h-4 after:h-3 after:w-3",
    medium: "w-11 h-6 after:h-5 after:w-5",
    large: "w-14 h-7 after:h-6 after:w-6"
  };

  const colorClasses = {
    blue: "peer-checked:bg-blue-600",
    green: "peer-checked:bg-green-600",
    red: "peer-checked:bg-red-600",
    purple: "peer-checked:bg-purple-600",
    yellow: "peer-checked:bg-yellow-600"
  };

  return (
    <label className={`inline-flex items-center cursor-pointer me-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={`
        relative 
        bg-gray-200 
        peer-focus:outline-none 
        rounded-full 
        peer 
        peer-checked:after:translate-x-full 
        peer-checked:after:border-white 
        after:content-[''] 
        after:absolute 
        after:top-[2px] 
        after:left-[2px] 
        after:bg-white 
        after:border-gray-300 
        after:border 
        after:rounded-full 
        after:transition-all 
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${disabled ? 'cursor-not-allowed' : ''}
      `} />
    </label>
  );
}