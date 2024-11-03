"use client";

import { useState } from "react";
import { AcademicCapIcon, BookOpenIcon, UserCircleIcon } from "@heroicons/react/16/solid";

export const SearchSection = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {menuSearch.length > 1 && (
        <div className="flex flex-row items-center space-between gap-2 w-full max-w-7xl pb-1">
          {/* Contenedor para la barra de búsqueda y botones */}
          <div className="flex flex-grow items-center">
            {/* Barra de búsqueda */}
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="input input-bordered flex-grow max-w h-8" // Ajusta el ancho aquí
            />
          </div>

          {/* Botones de búsqueda */}
          <div className="flex flex-row gap-2 flex-wrap pl-5">
            {menuSearch.map(item => (
              <button
                style={{ backgroundColor: item.label === selectedOption ? "#004aad" : "" }}
                className={` btn btn-sm font-light rounded-[8px] ${
                  item.label === selectedOption
                    ? "bg-[#004aad]  hover:bg-base-400 no-animation hover:text-white text-white"
                    : "text-black bg-base-100 hover:bg-[#004aad] hover:text-white dark:text-white"
                }`}
                key={item.label}
                onClick={() => setSelectedOption(item.label)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export const menuSearch = [
  {
    label: "Courses",
    icon: <BookOpenIcon className="h-4 w-4" />,
  },
  {
    label: "Students",
    icon: <UserCircleIcon className="h-4 w-4" />,
  },
  {
    label: "Educators",
    icon: <AcademicCapIcon className="h-4 w-4" />,
  },
];
