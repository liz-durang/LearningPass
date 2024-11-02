import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Courses",
  description: "View your Courses",
});

const Courses: NextPage = () => {
  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">My Courses</h1>
        <p className="text-neutral">View your Courses</p>
      </div>
    </>
  );
};

export default Courses;
