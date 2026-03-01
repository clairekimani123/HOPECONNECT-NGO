import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/donate", label: "Donate", protected: true },
  { to: "/contact", label: "Contact" },
];

function Navbar(){
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };

  const handleProtectedClick = (e, to, isProtected) => {
    if (isProtected && !user) {
      e.preventDefault();
      alert("Please login to access this page");
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          HOPE CONNECT
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex space-x-8 items-center">
          {links.map(({ to, label, protected: isProtected }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={(e) => handleProtectedClick(e, to, isProtected)}
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Admin Dashboard link — only visible to admins */}
          {user?.role === 'admin' && (
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-1 text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition"
              >
                ⚙️ Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center space-x-4">
          
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition cursor-pointer"
            >
              Login
            </button>
          )}

          {user && (
            <div className="relative" ref={dropdownRef}>
              <img
                src="https://i.pinimg.com/736x/87/22/ec/8722ec261ddc86a44e7feb3b46836c10.jpg"
                alt={user.displayName}
                className="h-10 w-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 shadow-md"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border py-2 z-50">
                  <div className="px-4 py-3 border-b text-sm text-gray-600">
                    Signed in as <br />
                    <strong className="text-gray-900">{user.email}</strong>
                    {/* Admin badge inside dropdown */}
                    {user.role === 'admin' && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Admin Dashboard link inside dropdown too */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-purple-700 hover:bg-purple-50 transition font-medium"
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-2 pt-2 pb-3 space-y-1">
          {links.map(({ to, label, protected: isProtected }) => (
            <Link
              key={to}
              to={to}
              onClick={(e) => {
                handleProtectedClick(e, to, isProtected);
                setMenuOpen(false);
              }}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
            >
              {label}
            </Link>
          ))}

          {/* Admin Dashboard link in mobile menu */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-purple-700 font-semibold hover:bg-purple-50 rounded-md"
            >
              ⚙️ Admin Dashboard
            </Link>
          )}

          {!user && (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="block w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition cursor-pointer"
            >
              Login
            </button>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="block w-full border-2 text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;