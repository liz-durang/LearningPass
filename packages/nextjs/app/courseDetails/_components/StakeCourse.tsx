import { useAccount } from "wagmi";
import {
  useScaffoldReadContract,
  useScaffoldWatchContractEvent,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

interface CourseCompletedProps {
  courseId: string;
}

const StakeCourse: React.FC<CourseCompletedProps> = ({ courseId }) => {
  const { writeContractAsync: writeCourseManager } = useScaffoldWriteContract("CourseManager");
  const { address: connectedAddress } = useAccount();

  useScaffoldWatchContractEvent({
    contractName: "StakingManager",
    eventName: "CourseStakeWithdrawn",
    // The onLogs function is called whenever a GreetingChange event is emitted by the contract.
    // Parameters emitted by the event can be destructed using the below example
    // for this example: event GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
    onLogs: logs => {
      logs.map(log => {
        const { user, courseId, amount } = log.args;
        console.log("📡 GreetingChange event", user, courseId, amount);
      });
    },
  });

  // Obtener detalles del curso
  const { data: dataCourse } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getCourseDetails",
    args: [BigInt(courseId)],
  });

  const courseDetails = dataCourse || [];

  const enrollCourse = async () => {
    try {
      await writeCourseManager({
        functionName: "enroll",
        args: [connectedAddress, BigInt(courseId)],
        value: courseDetails[4],
      });
      console.log("completado");
    } catch (e) {
      console.error("Error", e);
    }
  };

  return (
    <>
      <div className="z-10">
        <div className="flex flex-col bg-base-100 dark:bg-gray-800 rounded-3xl shadow-md border border-base-300 dark:border-gray-700 relative p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 overflow-hidden">Description</h3>
          <p>
            This online Solidity course is designed to take you from beginner to advanced in smart contract development
            on the Ethereum blockchain. Whether you are new to programming or already have coding experience, you will
            learn how to build decentralized applications (dApps) using Solidity,
          </p>
        </div>

        <div className="flex justify-end mt-5">
          <button className="btn btn-primary btn-sm" onClick={enrollCourse}>
            Enroll to {courseDetails[5]}
          </button>
        </div>
      </div>
    </>
  );
};

export default StakeCourse;
