"use client";

import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export function Counter() {
  const { data: counter } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "counter",
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  return (
    <>
      {/* Counter Example by Workshop */}

      <h1 className="text-center">A simple Counter</h1>

      <p className="text-center">Counter: {counter?.toString()}</p>

      <button
        className="btn btn-primary"
        onClick={async () => {
          try {
            await writeYourContractAsync({
              functionName: "decrement",
            });
          } catch (e) {
            console.error("Error decrementing counter:", e);
          }
        }}
      >
        Decrement
      </button>

      <button
        className="btn btn-primary m-2"
        onClick={async () => {
          try {
            await writeYourContractAsync({
              functionName: "increment",
            });
          } catch (e) {
            console.error("Error incrementing counter:", e);
          }
        }}
      >
        Increment
      </button>
    </>
  );
}
