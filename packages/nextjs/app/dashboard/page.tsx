import { AvailableCourses } from "./_components/AvailableCourses";
import { ContinueLearning } from "./_components/ContinueLearning";
import { PassportPreview } from "./_components/PassportPreview";
import { SearchSection } from "./_components/SearchSection";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Dashboard",
  description: "View your Dashboard",
});

const Dashboard: NextPage = () => {
  return (
    <>
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0">
          <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <PassportPreview />

            <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
              <p className="my-0 text-2xl font-bold">Welcome back!</p>

              <ContinueLearning showButton={true} />

              <SearchSection />

              <h2 className="my-0 text-xl font-semibold">Available Courses</h2>
              <AvailableCourses />

              <h2 className="my-0 text-xl font-semibold">Certify your Solidity Knowledge</h2>
              <AvailableCourses />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
