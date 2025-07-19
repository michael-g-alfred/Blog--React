import React, { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import ImageIcon from "../icons/ImageIcon";
import { AuthContext } from "../context/AuthProvider";
import MenuIcon from "../icons/MenuIcon";
import CloseIcon from "../icons/CloseIcon";
import PanelLayout from "../layout/PanelLayout";
import IconTitleBtn from "./IconTitleBtn";
import LogoutIcon from "../icons/LogoutIcon";
import HomeIcon from "../icons/HomeIcon";
import LoginIcon from "../icons/LoginIcon";
import PhotoName from "./PhotoName";

const Navbar = () => {
  const { currentUser, isAuthenticated, signout } = useContext(AuthContext); // Auth state
  const [menuPanel, setMenuPanel] = useState(false); // Burger menu toggle
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuPanel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation tabs
  const baseTabs = [
    { id: "home", label: "Home", svg: <HomeIcon />, path: "/" },
    ...(isAuthenticated
      ? [{ id: "logout", label: "Logout", svg: <LogoutIcon />, path: "/" }]
      : [
          {
            id: "registeration",
            label: "Registeration",
            svg: <LoginIcon />,
            path: "/registeration",
          },
        ]),
  ];

  function toggleMenu() {
    setMenuPanel((prev) => !prev);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 h-16 flex items-center border-b bg-blue-700 border-blue-50 shadow-xs px-4">
      <div className="flex items-center justify-between w-full">
        {/* Left: Navigation Tabs */}
        {/* Mobile Burger Menu */}
        <div ref={menuRef} className="md:hidden flex items-center relative">
          <button
            onClick={toggleMenu}
            className="text-blue-50 focus:outline-none hover:bg-blue-500 rounded-full p-2">
            <span>{menuPanel ? <CloseIcon /> : <MenuIcon />}</span>
          </button>
          <PanelLayout
            className={`w-44 top-13 absolute transition-all duration-300 ${
              menuPanel
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}>
            {baseTabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`block px-4 py-2 text-sm  ${
                  tab.id === "logout"
                    ? "bg-red-700 hover:bg-red-500 text-red-50"
                    : "bg-blue-700 hover:bg-blue-500 text-blue-50"
                } rounded`}
                onClick={(e) => {
                  if (tab.id === "logout") {
                    e.preventDefault();
                    signout();
                  }
                  setMenuPanel(false);
                }}>
                <IconTitleBtn
                  svg={tab.svg}
                  h4={tab.label}
                  className={"justify-start"}
                />
              </Link>
            ))}
          </PanelLayout>
        </div>
        <div className="hidden md:flex items-baseline gap-1">
          {baseTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              onClick={(e) => {
                if (tab.id === "logout") {
                  e.preventDefault();
                  signout();
                }
                setMenuPanel(false);
              }}
              className={({ isActive }) =>
                tab.id === "logout"
                  ? "p-3 text-sm font-medium text-red-50 bg-red-700 hover:bg-red-500 rounded-md"
                  : `p-3 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-blue-950 text-blue-50"
                        : "text-blue-50 hover:bg-blue-500"
                    }`
              }>
              {tab.label}
            </NavLink>
          ))}
        </div>
        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <NavLink
            to="/"
            className="flex-shrink-0 flex items-center cursor-pointer transition-transform duration-200 hover:scale-125 ease-in-out">
            <span className="w-10 h-10 text-blue-50">
              <ImageIcon />
            </span>
          </NavLink>
        </div>
        {/* Right: User info */}
        <div className="flex items-center">
          {currentUser && (
            <>
              {/* Avatar link */}
              <NavLink to={`/profile/${currentUser?.uid}`}>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="UserPhoto"
                    className="w-12 h-12 rounded-full object-cover border-1 border-gray-700"
                  />
                ) : (
                  <div className="w-12 h-12 flex justify-center items-center bg-gray-300 border-1 border-gray-700 text-gray-700 text-sm rounded-full">
                    <PhotoName />
                  </div>
                )}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
