import Link from "next/link";
import { useAccount } from "wagmi";
import {
  useScaffoldReadContract,
  useScaffoldWatchContractEvent,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

interface CourseCompletedProps {
  courseId: string;
}

const CourseCompleted: React.FC<CourseCompletedProps> = ({ courseId }) => {
  const { writeContractAsync: writeStakingManagerAsync } = useScaffoldWriteContract("StakingManager");
  const { address: connectedAddress } = useAccount();

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

  // Obtener si ya hizo withdraw
  const { data: dataWithdraw } = useScaffoldReadContract({
    contractName: "StakingManager",
    functionName: "checkWithdrawStatus",
    args: [connectedAddress, BigInt(courseId)],
  });

  const withdrawDetails = dataWithdraw || [];

  useScaffoldWatchContractEvent({
    contractName: "StakingManager",
    eventName: "CourseStakeWithdrawn",
    onLogs: logs => {
      logs.forEach(log => {
        const { user, courseId, amount } = log.args;
        console.log("📡 CourseStakeWithdrawn event", user, courseId, amount);
      });
    },
  });

  const { data: data2 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "hasStudentCompletedCourse",
    args: [BigInt(courseId), connectedAddress],
  });

  const hasStudentCompletedCourse = data2;

  const withdrawCourse = async () => {
    try {
      await writeStakingManagerAsync({
        functionName: "withdrawStakeCourse",
        args: [connectedAddress, BigInt(courseId)],
      });
    } catch (e) {
      console.error("Error al enviar:", e);
    }
  };

  return (
    <>
      {hasStudentCompletedCourse && (
        <div className="flex flex-col p-8 bg-blue-100 rounded-lg shadow-md w-full border mb-5 text-center">
          <div className="flex justify-between items-center gap-6 text-center">
            <div className="text-center w-1/2">
              <p className="text-gray-600">You have regained your course investment</p>
              <div className="bg-white px-2 p-1 rounded-md text-center mb-5 w-20 mx-auto">
                <span className="text-md text-gray-500 dark:text-gray-400">{courseDetails[4]?.toString()} ETH</span>
              </div>

              {Array.isArray(withdrawDetails) && withdrawDetails.length === 0 ? (
                <button className="btn btn-primary btn-sm" onClick={withdrawCourse}>
                  Withdraw
                </button>
              ) : (
                <p className="text-center text-md font-medium text-gray-400">Withdrawn</p>
              )}
            </div>

            <div className="w-1/2">
              <p className="text-gray-600">Have you seen your new achievement?</p>
              <p className="text-md text-gray-500 dark:text-gray-40">100% Progress</p>
              <Link href="/my-passport" className="btn btn-primary btn-sm">
                Go to my passport
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            {/* Puedes agregar más detalles aquí si es necesario */}
          </div>
        </div>
      )}

      {rewardsDetails.length > 0 && (
        <>
          <h2 className="my-0 text-xl font-semibold">You have achieved additional rewards</h2>
          <div className="flex flex-col bg-white rounded-lg shadow-md w-full border mb-5 px-6 lg:px-8 mb-6 py-5">
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
          </div>
        </>
      )}
    </>
  );
};

export default CourseCompleted;
