import React, { useState } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { MdChangeCircle, MdOutlineChat } from "react-icons/md";
import { AiOutlineCloudUpload, AiFillYoutube, AiFillGithub, AiFillFileExcel } from "react-icons/ai";
import { Link } from "react-router-dom";

function Sidenav() {
  const menus = [
    { name: "Change Model", link: "/", icon: MdChangeCircle, margin: true},
    { name: "PDF", link: "/upload", icon: AiOutlineCloudUpload , margin: true},
    { name: "Youtube", link: "#", icon: AiFillYoutube },
    { name: "Github", link: "#", icon: AiFillGithub },
    { name: "Excel", link: "#", icon: AiFillFileExcel },
    { name: "Chat", link: "/chat", icon: MdOutlineChat, margin: true },
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div
        className={`bg-[#0e0e0e] min-h-full ${
          isOpen ? "w-56" : "w-16"
        } duration-200 text-gray-100 px-4`}
      >
        <div className="py-1 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <div className="mt-1v flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-3v"
              } group flex items-center text-base gap-3 font-medium p-2 hover:bg-gray-800 rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                className={`whitespace-pre duration-200 ${
                  !isOpen && "opacity-0 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  isOpen && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
