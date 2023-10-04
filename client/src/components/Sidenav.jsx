// SideNav.js
import React, { useState } from 'react';

function Sidenav() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidenav ${isOpen ? 'w-32' : 'w-0'} transition-all duration-300`}>
      <button
        className="toggle-button bg-gray-800 text-white py-2 px-4 rounded-md m-2"
        onClick={toggleNav}
      >
        |||
      </button>
      {isOpen && (
        <ul className="list-none p-0">
          <li><a href="#" className="text-black hover:bg-gray-600 py-2 px-4 block">PDF</a></li>
          <li><a href="#" className="text-black hover:bg-gray-600 py-2 px-4 block">Youtube</a></li>
        </ul>
      )}
    </div>
  );
}

export default Sidenav;
