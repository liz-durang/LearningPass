"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { BookOpenIcon, InboxIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const PassportPreview = () => {
  const { address: connectedAddress } = useAccount();

  // Obtener detalles del pasaporte
  const { data: dataPassport } = useScaffoldReadContract({
    contractName: "MyPassport",
    functionName: "getPassportDetails",
    args: [connectedAddress],
  });

  const profilePassport = dataPassport || [];

  // Verificar si el pasaporte es válido
  const { data: isValidPassport } = useScaffoldReadContract({
    contractName: "MyPassport",
    functionName: "isPassportValid",
    args: [connectedAddress],
  });

  // Obtener roles
  const { data: getRoles } = useScaffoldReadContract({
    contractName: "MyPassport",
    functionName: "getRoles",
    args: [connectedAddress],
  });

  const rolPassport = getRoles || [];

  // Obtener total de staking
  const { data: dataTotalStake } = useScaffoldReadContract({
    contractName: "StakingManager",
    functionName: "getTotalStakeCourses",
    args: [connectedAddress],
  });

  const totalStake = dataTotalStake?.[0] || 0;
  const totalCourses = dataTotalStake?.[1] || 0;

  return (
    <>
      {isValidPassport ? ( // Verificar si el pasaporte es válido antes de mostrar
        <div className="col-span-1 flex flex-col bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 py-5">
          <div className="flex items-center">
            <UserCircleIcon className="w-24 h-24" />

            <div>
              <h2 className="text-lg font-bold">{profilePassport[0]}</h2>
              <span className="text-sm text-gray-400">@{profilePassport[4]}</span>
              <br />
              <span className="text-sm font-medium text-gray-600 dark:text-white">As {rolPassport}</span>
            </div>
          </div>

          <div className="mt-1">
            <p className="text-sm text-gray-600 dark:text-white font-medium">{profilePassport[1]}</p>
          </div>

          <p className="font-bold">Current Staked Amount</p>
          {totalStake > 0 && totalCourses > 0 ? (
            <div className="bg-base-300 rounded-3xl px-4 py-4 shadow-lg" style={{ backgroundColor: "#d5f7e8" }}>
              <div className="flex items-center space-x-2 p-2 mx-auto">
                <InboxIcon className="w-6 dark:text-black" />
                <span className="text-xl font-semibold text-center dark:text-black">{totalStake.toString()}</span>
                <span style={{ color: "#04b267" }} className="text-gl font-semibold text-center dark:text-black">
                  ETH
                </span>
              </div>

              <div className="flex items-center space-x-2 p-2 mx-auto">
                <BookOpenIcon className="w-6 dark:text-black" />
                <span className="text-xl font-semibold text-center dark:text-black">{totalCourses.toString()}</span>
                <span style={{ color: "#04b267" }} className="text-gl font-semibold text-center dark:text-black">
                  Courses Enrolled
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg font-medium text-gray-500">There is no staking yet</p>
          )}

          <br />
          <p className="font-bold">My Last Achievements</p>
          <ul className="flex flex-wrap gap-4">
            {courses.slice(-4).map(course => (
              <li key={course.id} className="flex items-start p-4 bg-white rounded-lg shadow-md w-full border">
                <Image
                  src={course.logo}
                  alt={`${course.name} logo`}
                  width={48}
                  height={48}
                  className="w-12 h-12 mr-4 rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-800">{course.name}</h3>
                  <span className="text-sm text-gray-500">{course.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-md w-full h-24 border">
          <p className="text-center text-lg font-medium text-gray-500">No passport found </p>
        </div>
      )}
    </>
  );
};

const courses = [
  {
    id: 1,
    logo: "/logo.svg",
    name: "Curso de Programación en JavaScript",
    description: "NFT Issuer",
  },
  {
    id: 2,
    logo: "/logo.svg",
    name: "Introducción a React",
    description: "NFT Issuer",
  },
  {
    id: 3,
    logo: "/logo.svg",
    name: "Desarrollo Web Full Stack Developer xd",
    description: "NFT Issuer",
  },
  {
    id: 4,
    logo: "/logo.svg",
    name: "Desarrollo Web Full Stack",
    description: "NFT Issuer",
  },
];
