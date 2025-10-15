/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Male from "../../assets/images/defaultImage.png";
import { adminProfileGet } from "../../store/adminSlice";
import { projectName } from "../../util/config";
import NotificationDialogue from "../notification/NotificationDialogue";

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { admin } = useSelector((state) => state.admin);
  const { dialogueType } = useSelector((state) => state.dialogue);

  const getAdminIn = typeof window !== "undefined" && JSON.parse(sessionStorage.getItem("admin_"));
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    if (getAdminIn) {
      setAdminData(getAdminIn);
    }
  }, []);

  useEffect(() => {
    dispatch(adminProfileGet());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const getAdminData = typeof window !== "undefined" && JSON.parse(sessionStorage.getItem("admin_"));
    const payload = {
      adminId: getAdminData?._id,
    };
    dispatch(adminProfileGet(payload));
  }, [dispatch]);

  return (
    <>
      {dialogueType === "notification" && <NotificationDialogue />}

      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Menu Toggle and Logo */}
            <div className="flex items-center space-x-4">
              {/* Menu Toggle Button */}
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <MenuIcon />
              </button>

              {/* Logo */}
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">4S</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {projectName}
                </span>
              </Link>
            </div>

            {/* Right Section - User Info */}
            <div className="flex items-center space-x-6">
              {/* User Name */}
              <div className="hidden sm:block">
                <span className="text-gray-700 font-medium capitalize text-lg">
                  {adminData ? adminData?.name : "Admin"}
                </span>
              </div>

              {/* User Profile Image */}
              <Link to="/profile" className="flex items-center space-x-3 group">
                <div className="relative">
                  {admin?.image?.length > 0 ? (
                    <img
                      src={admin.image}
                      alt="Admin"
                      width={48}
                      height={48}
                      className="rounded-xl border-2 border-white shadow-lg transition-all duration-200 group-hover:border-red-300 group-hover:scale-105"
                      style={{
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.currentTarget.src = Male)}
                    />
                  ) : (
                    <img
                      src={Male}
                      alt="Default"
                      width={48}
                      height={48}
                      className="rounded-xl border-2 border-white shadow-lg transition-all duration-200 group-hover:border-red-300 group-hover:scale-105"
                    />
                  )}
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                {/* Mobile User Name */}
                <div className="block sm:hidden">
                  <span className="text-gray-700 font-medium capitalize">
                    {adminData ? adminData?.name : "Admin"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;