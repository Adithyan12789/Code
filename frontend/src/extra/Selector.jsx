/* eslint-disable no-unused-vars */
export default function Selector({
  label,
  placeholder,
  selectValue,
  paginationOption = true,
  id,
  labelShow = true,
  selectData = [],
  onChange,
  defaultValue,
  errorMessage,
  selectId,
  disabled = false,
}) {
  return (
    <div className="w-full flex flex-col gap-1">
      {/* Label */}
      {labelShow && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      {/* Select Box */}
      <div className="relative">
        <select
          id={id || "selector"}
          className={`w-full px-3 py-2 border rounded-md text-gray-700 bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            text-capitalize
            ${errorMessage ? "border-red-500" : "border-gray-300"}
          `}
          value={selectValue || ""}
          onChange={onChange}
          disabled={disabled}
        >
          {/* Placeholder Option */}
          {paginationOption !== false && (
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
          )}

          {/* Select Data Options */}
          {selectData?.map((item, index) => (
            <option
              key={index}
              value={typeof item === "string" ? item : item.value || ""}
            >
              {typeof item === "string" ? item : item.label || item.name}
            </option>
          ))}
        </select>

        {/* Dropdown Icon (optional) */}
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
