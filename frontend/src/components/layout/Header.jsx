import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/images/favicon.ico"; // adjust path if needed

const menuItems = [
  { label: "Home", url: "/" },
  { label: "Dashboard", url: "/dashboard/analytics" },
  { label: "Newsletter", url: "/newsletter" },
];

const ActiveMenuLink = ({ children, to }) => {
  const location = useLocation();
  const active =
    to === location.pathname ||
    (to.startsWith("/dashboard") && location.pathname.startsWith("/dashboard"));

  return (
    <Link
      to={to}
      className={`hover:bg-gray-100 p-2 rounded block ${
        active ? "text-black font-semibold" : "text-gray-500"
      }`}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const [search, setSearch] = useState("");

  return (
    <header className="flex flex-col gap-5">
      <div className="py-4 flex items-center">
        <Link to="/">
          <img
            src={Logo}
            alt="logo"
            className="w-8 md:w-9"
          />
        </Link>

        <nav className="ml-8">
          <ul className="flex flex-wrap gap-x-8 text-gray-900">
            {menuItems.map(({ url, label }, index) => (
              <li key={index}>
                <ActiveMenuLink to={url}>{label}</ActiveMenuLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500"
        placeholder="Search..."
      />
    </header>
  );
};

export default Header;
