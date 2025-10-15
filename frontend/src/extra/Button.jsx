export default function Button({
  newClass = "",
  btnColor = "",
  btnName,
  onClick,
  style,
  btnIcon,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      className={`themeBtn text-center ${newClass} ${btnColor}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
      type={type}
    >
      {btnIcon && (
        <>
          {btnIcon}{" "}
        </>
      )}
      {btnName}
    </button>
  );
}
