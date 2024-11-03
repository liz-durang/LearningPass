"use client";

import Image from "next/image";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface CoursePreviewProps {
  courseId: string; // Recibe el ID del curso como prop
}

export const CoursePreview: React.FC<CoursePreviewProps> = ({ courseId }) => {
  // Obtener detalles del curso
  const { data: dataCourseDetails } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getCourseDetails",
    args: [BigInt(courseId)],
  });

  const courseDetails = dataCourseDetails || [];

  // Obtener rewards por curso
  const { data: dataRewards } = useScaffoldReadContract({
    contractName: "RewardManager",
    functionName: "getAllRewardsByCourse",
    args: [BigInt(courseId)],
  });

  const rewardsDetails = dataRewards || [];

  return (
    <>
      {courseDetails.length > 0 ? (
        <div className="col-span-1 flex flex-col bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 py-5">
          <p className=" text-lg font-bold">{"Evaluation"} Staking</p>

          <div className="flex justify-between items-center">
            <div className=" bg-secondary px-2 p-1 rounded-md text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">{courseDetails[4]?.toString()} ETH</span>
            </div>

            <div className="text-center px-2">
              <span className="text-sm text-gray-500 dark:text-gray-400"></span>
            </div>
          </div>

          <br />
          {rewardsDetails.length > 0 && (
            <>
              <h3 className="text-lg font-bold mt-4">Additional rewards</h3>
              <ul>
                {rewardsDetails.map((reward, index) => (
                  <li key={index}>
                    <div className="flex flex-col">
                      <div className="flex w-full mb-2 items-center">
                        <div className="w-2/3">
                          <p className="text-sm text-gray-500">{reward.description}</p>
                        </div>
                        <div className="w-1/2 flex flex-col items-end pl-2">
                          <div className="bg-secondary px-2 p-1 rounded-md text-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {reward.amount.toString()} ETH
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <br />
          <h3 className="text-lg font-bold">Your NFT on completion</h3>
          <div className="py-2">
            <Image src="/logo.svg" alt="" width={150} height={150} />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-md w-full h-24 border">
          <p className="text-center text-lg font-medium text-gray-500">No course or evaluation found </p>
        </div>
      )}
    </>
  );
};
