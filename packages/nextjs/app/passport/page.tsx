import { Counter } from "./_components/Counter";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Passport",
  description: "View your Profile and NFTs",
});

const Passport: NextPage = () => {
  return (
    <>
      {/* Counter Example by Workshop */}

      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">My Passport</h1>
        <p className="text-neutral">View your Profile and NFTs</p>

        <Counter />
      </div>
    </>
  );
};

export default Passport;
