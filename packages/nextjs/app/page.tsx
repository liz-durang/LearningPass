"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { AcademicCapIcon, BugAntIcon, GlobeAltIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        className="w-full h-[50vh] md:h-[50vh] lg:h-[100vh] mt-[-5%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/LearningPass2.png')" }}
      >
        {/* Contenido opcional aquí */}
      </section>

      {/* Beneficios */}
      <section className="flex-grow bg-white w-full px-8 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6 ">Why choose LearningPass?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col bg-gray-50 p-6 text-center items-center rounded-lg shadow-md border border-accent text-gray-700 relative">
            <AcademicCapIcon className="h-8 w-8 text-primary absolute top-4 left-4" />
            <h3 className="font-bold text-lg mt-8">Continuous Motivation</h3>
            <p>With refundable enrollment and milestone rewards, we encourage ongoing learning and development</p>
          </div>
          <div className="flex flex-col bg-gray-50 p-6 text-center items-center rounded-lg shadow-md border border-accent text-gray-700 relative">
            <GlobeAltIcon className="h-8 w-8 text-primary absolute top-4 left-4" />
            <h3 className="font-bold text-lg mt-8">Skills Validation</h3>
            <p>On-chain NFTs validate your skills, authenticated by the original creators of the content.</p>
          </div>
          <div className="flex flex-col bg-gray-50 p-6 text-center items-center rounded-lg shadow-md border border-accent text-gray-700 relative">
            <BugAntIcon className="h-8 w-8 text-primary absolute top-4 left-4" />
            <h3 className="font-bold text-lg mt-8">On-Chain Transparency</h3>
            <p>Achievements recorded on the blockchain ensure reliable educational traceability </p>
          </div>
          <div className="flex flex-col bg-gray-50 p-6 text-center items-center rounded-lg shadow-md border border-accent text-gray-700 relative">
            <MagnifyingGlassIcon className="h-8 w-8 text-primary absolute top-4 left-4" />
            <h3 className="font-bold text-lg mt-8">Job Opportunities</h3>
            <p>A verifiable track record that enhances your professional profile in the Web3 ecosystem </p>
          </div>
        </div>
        <Link href="/dashboard">
          <button className="bg-primary text-white font-bold py-3 px-6 rounded-lg mt-10">Get Started</button>
        </Link>
      </section>
    </>
  );
};

export default Home;
