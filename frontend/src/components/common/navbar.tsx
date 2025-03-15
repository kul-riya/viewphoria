import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-[#7B88E7] via-[#991FA6] to-[#65026D]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent z-10"></div>
      <nav className="w-full relative text-white z-20 poppins-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-3">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="text-gray-200 hover:text-white focus:outline-none"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo and Navigation Links - Desktop */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <NavLink
                to="/credential-management"
                className={({ isActive }: { isActive: Boolean }) =>
                  `flex flex-col ${
                    isActive
                      ? "border-b-white"
                      : "text-gray-200 hover:text-white"
                  }`
                }
              >
                <div className="text-lg">CREDENTIAL</div>
                <div className="text-sm text-gray-300">Management</div>
              </NavLink>

              <NavLink
                to="/advanced-data-discovery"
                className={({ isActive }: { isActive: Boolean }) =>
                  `flex flex-col ${
                    isActive
                      ? "border-b-white"
                      : "text-gray-200 hover:text-white"
                  }`
                }
              >
                <div className="text-lg">ADVANCED</div>
                <div className="text-sm text-gray-300">Data Discovery</div>
              </NavLink>
            </div>

            {/* User Profile Icon */}
            <div className="flex items-center">
              <div className="ml-3">
                <div className="text-white p-1 rounded-full">
                  <User className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/credential-management"
              className={({ isActive }: { isActive: Boolean }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-200 hover:bg-black"
                }`
              }
            >
              <div className="font-bold">CREDENTIAL</div>
              <div className="text-sm text-gray-300">Management</div>
            </NavLink>

            <NavLink
              to="/advanced-data-discovery"
              className={({ isActive }: { isActive: Boolean }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-200 hover:bg-black"
                }`
              }
            >
              <div className="font-bold">ADVANCED</div>
              <div className="text-sm text-gray-300">Data Discovery</div>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
