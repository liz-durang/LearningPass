"use client";

import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const AvailableCourses = () => {
  const { data: data1 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getAllCourses",
  });

  const availableCourses = data1 || [];

  // Configuración del carrusel con flechas predeterminadas de Slick
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {availableCourses.length > 0 ? (
        <div className="z-10">
          <Slider {...settings} className="">
            {availableCourses.map(course => (
              <div
                key={course.courseId}
                className="bg-base-100 dark:bg-gray-800 rounded-lg shadow-md border border-base-300 dark:border-gray-700 p-6 relative "
              >
                {/* Tipo de curso en la esquina superior derecha */}
                <span className="absolute top-3 right-3 bg-gray-200 text-gray-800 text-xs rounded-full px-2 py-1">
                  {course.courseType} {/* Asume que `courseType` está en el objeto del curso */}
                </span>

                <Image
                  src="/images/vottun101.webp"
                  alt={`${course.name} logo`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">{course.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">{course.description}</span>
                <br />
                <span className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4 font-bold">
                  Provided by {course.provider}
                </span>
                <div className="flex justify-between items-center mt-3">
                  <div className=" px-2 p-1 rounded-md">
                    <span className="text-sm text-gray-600 dark:text-gray-400 ">
                      {course.stakingRequirement.toString()} ETH
                    </span>
                  </div>
                  <Link
                    href={{
                      pathname: "/courseDetails",
                      query: {
                        id: course.courseId.toString(),
                        title: course.name,
                        description: course.description,
                        provider: course.provider,
                        type: course.courseType,
                      },
                    }}
                  >
                    <button className="btn btn-sm btn-primary">Learn More</button>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p className="text-center text-lg font-medium text-gray-500">There are no available courses</p>
      )}
    </>
  );
};
