import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Input(props) {
  const {
    label,
    name,
    id,
    type = "text",
    onChange,
    newClass,
    value,
    defaultValue,
    errorMessage,
    placeholder,
    disabled,
    onFocus,
    readOnly,
    onKeyPress,
    checked,
    onClick,
    required,
    style,
    accept,
    fieldClass,
    labelShow = true,
  } = props;

  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  // Prevent scroll on number input
  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement.type === "number") {
        event.preventDefault();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className={`custom-input ${type} ${newClass} ${type === "gender" ? "me-2 mb-0" : ""}`}>
      {labelShow && <label className="m-0" htmlFor={id}>{label}</label>}
      <input
        type={inputType}
        className={`${type === "file" ? "form-control" : "form-input"} ${fieldClass || ""}`}
        id={id}
        name={name}
        onChange={onChange}
        value={value ?? ""}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onKeyDown={onKeyPress}
        checked={checked}
        onClick={onClick}
        required={required}
        onFocus={onFocus}
        style={style}
        accept={accept}
        autoComplete="off"
      />
      {type !== "search" && errorMessage && <p className="errorMessage">{errorMessage}</p>}

      {type === "password" && (
        <div className="passHideShow" onClick={togglePasswordVisibility}>
          {inputType === "password" ? (
            <VisibilityIcon sx={{ fill: "#c9c9c9" }} />
          ) : (
            <VisibilityOffIcon sx={{ fill: "#c9c9c9" }} />
          )}
        </div>
      )}

      {type === "search" && !value && (
        <div className="searching">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      )}
    </div>
  );
}

// Textarea component
export const Textarea = ({
  id,
  label,
  row = 3,
  col,
  placeholder,
  name,
  errorMessage,
  onChange,
  readOnly,
  value,
}) => {
  return (
    <div className="inputData text-start">
      {label && (
        <label style={{ color: "black", fontWeight: 600, marginBottom: "5px" }} htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={row}
        cols={col}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        className="form-control"
      />
      {errorMessage && <p className="errorMessage text-start text-danger">{errorMessage}</p>}
    </div>
  );
};
