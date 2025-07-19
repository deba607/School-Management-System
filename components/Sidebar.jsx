import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/student-management' },
    { name: 'Teachers', path: '/teacher-management' },
    { name: 'Classes', path: '/class-section-management' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Grades', path: '/grades' },
    { name: 'Finance', path: '/finance' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-8 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <span
          className={`block h-1 bg-gray-800 dark:bg-white rounded transform transition duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-3.5' : ''
          }`}
        />
        <span
          className={`block h-1 bg-gray-800 dark:bg-white rounded transition duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block h-1 bg-gray-800 dark:bg-white rounded transform transition duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-3.5' : ''
          }`}
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          ERP School Management
        </div>
        <nav className="p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  to={item.path}
                  className={`block px-3 py-2 rounded transition duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 font-semibold'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)} // Close sidebar on navigation
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
