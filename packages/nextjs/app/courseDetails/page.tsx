"use client";

import { useSearchParams } from "next/navigation";
import { ContinueLearning } from "../dashboard/_components/ContinueLearning";
import CourseCompleted from "./_components/CourseCompleted";
import { CoursePreview } from "./_components/CoursePreview";
import Evaluation from "./_components/Evaluation";
import StakeCourse from "./_components/StakeCourse";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const CourseDetails: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const searchParams = useSearchParams();

  const id = searchParams.get("id") || "";
  const title = searchParams.get("title") || "";
  const provider = searchParams.get("provider") || "";
  const description = searchParams.get("description") || "";
  const type = searchParams.get("type") || "";

  const { data: data1 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getStudentProgress",
    args: [BigInt(id), connectedAddress],
  });

  const progress = data1 || "";

  const { data: data2 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "isEnrolled",
    args: [BigInt(id), connectedAddress],
  });

  const isEnrolled = data2;

  const { data: data3 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "hasStudentCompletedCourse",
    args: [BigInt(id), connectedAddress],
  });

  const hasStudentCompletedCourse = data3 || false;
  console.log(hasStudentCompletedCourse);
  console.log(isEnrolled);
  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0">
        <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <CoursePreview courseId={id} />
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <ContinueLearning
              showButton={false}
              name={title}
              description={description}
              provider={provider}
              progress={Number(progress)}
              isEnrolled={isEnrolled}
              type={type}
            />

            {/* Mostrar Evaluation solo si no se ha completado */}
            {!hasStudentCompletedCourse && isEnrolled && (
              <>
                <h2 className="my-0 text-xl font-semibold">Evaluation</h2>
                <Evaluation courseId={id} />
              </>
            )}

            {/* Mostrar completed solo si se ha completado */}
            {hasStudentCompletedCourse && (
              <>
                <h2 className="my-0 text-xl font-semibold">Congratulations! You have passed the final evaluation</h2>
                <CourseCompleted courseId={id} />
              </>
            )}

            {/* Mostrar enrolarse solo si no se ha completado */}
            {!hasStudentCompletedCourse && !isEnrolled && (
              <>
                <h2 className="my-0 text-xl font-semibold">Learn more about your course</h2>
                <StakeCourse courseId={id} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
