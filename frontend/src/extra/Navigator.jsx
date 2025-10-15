import { Tooltip } from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function Navigator(props) {
  const location = useLocation();
  const pathname = location.pathname;

  const { name, path, navIcon, onClick, navIconImg, navSVG, liClass } = props;

  const isPathActive = Array.isArray(path)
    ? path.includes(pathname)
    : pathname === path;

  const handleOnChange = (e) => {
    console.log("handleOnChange", e.target.value);
  };

  const linkHref = Array.isArray(path) ? path[0] : path || "#";

  return (
    <ul className="mainMenu list-none m-0 p-0">
      <li
        onClick={onClick}
        className={`group cursor-pointer transition-all duration-300 ${
          liClass || ""
        }`}
        onChange={handleOnChange}
        value={name}
      >
        <Link
          to={linkHref}
          className={`flex items-center justify-between px-4 py-2 rounded-md transition-all duration-200 ${
            isPathActive
              ? "bg-pink-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* ICON SECTION */}
            {navIconImg ? (
              <img
                src={navIconImg}
                alt={name}
                className="w-5 h-5 object-contain"
              />
            ) : navIcon ? (
              <i className={`${navIcon} text-[18px]`}></i>
            ) : (
              navSVG
            )}

            <span className="capitalize text-[15px] font-medium">{name}</span>
          </div>

          {/* Submenu Arrow */}
          {props?.children && (
            <KeyboardArrowRightIcon className="text-gray-500 group-hover:text-gray-800 transition-all" />
          )}
        </Link>

        {/* SUBMENU */}
        {Array.isArray(props.children) && (
          <ul className="subMenu ml-6 mt-2 list-none transform transition-all duration-200 ease-in-out">
            {props.children.map((res, index) => {
              const { subName, subPath, onClick } = (res && res.props) || {};
              return (
                <Tooltip key={index} title={subName} placement="right">
                  <li>
                    <Link
                      to={subPath}
                      onClick={onClick}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-[14px] transition-all duration-150 ${
                        pathname === subPath
                          ? "text-pink-600 font-semibold"
                          : "text-gray-600 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <FiberManualRecordIcon
                        style={{ fontSize: "10px" }}
                        className={`${
                          pathname === subPath
                            ? "text-pink-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span>{subName}</span>
                    </Link>
                  </li>
                </Tooltip>
              );
            })}
          </ul>
        )}
      </li>
    </ul>
  );
}
