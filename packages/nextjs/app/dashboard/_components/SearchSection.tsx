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
                className={`btn btn-secondary btn-sm font-light hover:border-transparent rounded-[8px] ${
                  item.label === selectedOption
                    ? "bg-base-300 hover:bg-base-300 no-animation"
                    : "bg-base-100 hover:bg-secondary"
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
