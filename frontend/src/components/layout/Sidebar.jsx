import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  IconLayoutDashboard,
  IconUsers,
  IconAward,
  IconSettings,
  IconUserCircle,
  IconLogout2,
  IconMovie,
  IconClipboardData,
  IconVideo,
  IconCoinRupee,
  IconVip,
  IconHistory,
  IconChevronDown,
} from "@tabler/icons-react";
import { warning } from "../../util/Alert";
import LiquidEther from "../../pages/LiquidEther";

const Sidebar = ({ collapsed, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    menu: true,
    film: true,
    package: true,
    general: true,
  });

  const handleLogout = async () => {
    handleCloseFunction();
    try {
      const logout = await warning();
      if (logout) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("key");
        sessionStorage.removeItem("isAuth");
        axios.defaults.headers.common["Authorization"] = "";
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseFunction = () => {
    localStorage.setItem("dialogueData", JSON.stringify({ dialogue: false }));
    localStorage.removeItem("multiButton");
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navBarArray = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <IconLayoutDashboard size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "User Management",
      path: ["/user", "/viewProfile", "/viewProfileHistory"],
      icon: <IconUsers size={22} />,
      onClick: handleCloseFunction,
    },
  ];

  const newsArray = [
    {
      name: "News Category",
      path: "/newsCategory",
      icon: <IconMovie size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "News Channel List",
      path: ["/newsChannelList", "/ViewShortVideo/:id"],
      icon: <IconClipboardData size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "News List",
      path: "/newsList",
      icon: <IconVideo size={22} />,
      onClick: handleCloseFunction,
    },
  ];

  const packageArray = [
    {
      name: "Coin Plan",
      path: "/coinPlan",
      icon: <IconCoinRupee size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "VIP Plan",
      path: "/vipPlan",
      icon: <IconVip size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "Order History",
      path: ["/orderHistory", "/coinPlanHistory"],
      icon: <IconHistory size={22} />,
      onClick: handleCloseFunction,
    },
  ];

  const generalArray = [
    {
      name: "Reward System",
      path: "/reward",
      icon: <IconAward size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "Settings",
      path: "/setting",
      icon: <IconSettings size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <IconUserCircle size={22} />,
      onClick: handleCloseFunction,
    },
    {
      name: "Log Out",
      icon: <IconLogout2 size={22} />,
      onClick: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${
          collapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-20"
            : "translate-x-0 w-64"
        }
        bg-gradient-to-b from-red-900/90 to-pink-900/90 shadow-2xl
        h-full overflow-hidden
      `}
      >
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={["#ff2727", "#ff0080", "#B19EEF", "#ff4444", "#ff1493"]}
            mouseForce={40}
            cursorSize={150}
            isViscous={true}
            viscous={15}
            iterationsViscous={64}
            iterationsPoisson={64}
            resolution={0.8}
            isBounce={true}
            autoDemo={true}
            autoSpeed={0.8}
            autoIntensity={3.5}
            takeoverDuration={0.15}
            autoResumeDelay={2000}
            autoRampDuration={0.4}
            blendMode="screen"
            displacementScale={1.2}
            turbulence={0.3}
            noiseScale={2.0}
            baseColor="#dc2626"
            colorIntensity={1.5}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col h-full bg-gradient-to-b from-red-900/80 to-pink-900/80 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-red-700/50 backdrop-blur-md">
            {!collapsed && (
              <Link
                to="/dashboard"
                className="flex items-center cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span className="text-red-600 font-bold text-lg">4S</span>
                  </div>
                  <span className="text-xl font-bold text-white drop-shadow-lg">
                    4SidesTv Shorts
                  </span>
                </div>
              </Link>
            )}
            {collapsed && (
              <Link
                to="/dashboard"
                className="flex items-center justify-center cursor-pointer"
              >
                <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-red-600 font-bold text-lg">4S</span>
                </div>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-2 px-3">
              <Section
                title="Menu"
                items={navBarArray}
                isOpen={openSections.menu}
                onToggle={() => toggleSection("menu")}
                collapsed={collapsed}
              />

              <Section
                title="News Management"
                items={newsArray}
                isOpen={openSections.film}
                onToggle={() => toggleSection("film")}
                collapsed={collapsed}
              />

              <Section
                title="Package"
                items={packageArray}
                isOpen={openSections.package}
                onToggle={() => toggleSection("package")}
                collapsed={collapsed}
              />

              <Section
                title="General"
                items={generalArray}
                isOpen={openSections.general}
                onToggle={() => toggleSection("general")}
                collapsed={collapsed}
              />
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

// Section Component
const Section = ({ title, items, isOpen, onToggle, collapsed }) => {
  return (
    <div className="mb-4">
      {!collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full p-3 text-red-100 hover:text-white hover:bg-red-800/50 rounded-xl transition-all duration-200 group backdrop-blur-sm"
        >
          <span className="text-sm font-semibold uppercase tracking-wider drop-shadow-md">
            {title}
          </span>
          <IconChevronDown
            size={16}
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
      )}

      {collapsed && (
        <div className="border-b border-red-700/50 mb-2 backdrop-blur-sm"></div>
      )}

      <div
        className={`
        space-y-1 transition-all duration-300
        ${isOpen || collapsed ? "block" : "hidden"}
      `}
      >
        {items.map((item) => (
          <NavItem key={item.name} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
};

// NavItem Component
const NavItem = ({ item, collapsed }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  // Check if current path matches
  React.useEffect(() => {
    const checkActive = () => {
      const currentPath = window.location.pathname;
      if (Array.isArray(item.path)) {
        setIsActive(item.path.some((path) => currentPath.startsWith(path)));
      } else if (item.path) {
        setIsActive(currentPath.startsWith(item.path));
      }
    };

    checkActive();
    window.addEventListener("popstate", checkActive);
    return () => window.removeEventListener("popstate", checkActive);
  }, [item.path]);

  const handleClick = () => {
    if (item.onClick) item.onClick();
    if (item.path && !item.isLogout) {
      navigate(Array.isArray(item.path) ? item.path[0] : item.path);
    } else if (item.onClick && !item.path) {
      item.onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center w-full p-3 rounded-xl transition-all duration-200 group backdrop-blur-sm
        ${
          isActive
            ? "bg-red-600/80 text-white shadow-lg transform scale-105"
            : "text-red-100 hover:bg-red-800/50 hover:text-white"
        }
        ${
          item.isLogout
            ? "text-red-200 hover:bg-red-700/50 mt-4 border-t border-red-700/50 pt-4"
            : ""
        }
      `}
    >
      <div
        className={`
        transition-colors duration-200
        ${isActive ? "text-white" : "text-red-300 group-hover:text-white"}
      `}
      >
        {item.icon}
      </div>

      {!collapsed && (
        <span
          className={`
          ml-3 text-sm font-medium transition-all duration-200 drop-shadow-md
          ${isActive ? "font-semibold" : ""}
        `}
        >
          {item.name}
        </span>
      )}

      {!collapsed && isActive && (
        <div className="ml-auto w-2 h-2 bg-white rounded-full drop-shadow-md"></div>
      )}
    </button>
  );
};

export default Sidebar;
