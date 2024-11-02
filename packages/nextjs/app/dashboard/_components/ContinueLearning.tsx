"use client";

import Image from "next/image";
import Link from "next/link";
import "./styleReactSlick.css";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface ContinueLearningProps {
  showButton: boolean; // Parámetro para controlar la visibilidad del botón
  name?: string; // Nombre del curso
  description?: string; // Descripción del curso
  provider?: string; // Proveedor del curso
  progress?: number; // Progreso del curso
  idCourse?: number; // ID del curso
  isEnrolled?: boolean; // Indica si el usuario está inscrito en el curso
  type?: string;
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({
  showButton,
  name,
  description,
  provider,
  progress,
  idCourse,
  isEnrolled,
  type,
}) => {
  const { address: connectedAddress } = useAccount();

  // Obtiene los cursos inscritos
  const { data: data1 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getEnrolledCourses",
    args: [connectedAddress],
  });

  const countEnrolledCourses = data1?.length || 0;
  const idFirstCourse = data1?.[0];

  // Obtiene detalles del curso
  const { data: data2 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getCourseDetails",
    args: [idFirstCourse],
  });

  const [courseName, courseDescription, courseProvider, enrolledStudents, stakingRequirement, courseType] = data2 || [
    "",
    "",
    "",
    "",
    "",
    "",
  ]; // Valores por defecto vacíos

  console.log(enrolledStudents, stakingRequirement);
  // Obtiene el progreso del estudiante
  const { data: data3 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getStudentProgress",
    args: [idFirstCourse, connectedAddress],
  });

  const progressPercentage = data3 || 0;

  // Objeto del curso de ejemplo con valores por defecto
  const course = {
    id: idCourse ?? idFirstCourse, // Usar idCourse si existe, de lo contrario usar idFirstCourse
    logo: "/logo.svg", // Reemplaza con la URL de tu logo
    name: name || courseName,
    description: description || courseDescription,
    provider: provider || courseProvider,
    progress: progress !== undefined ? progress : progressPercentage, // Asegúrate de que `progress` no sea `undefined`
    type: type || courseType,
  };

  // Obtiene si el usuario está inscrito en el curso
  const { data: data4 } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "isEnrolled",
    args: [idFirstCourse, connectedAddress],
  });

  // Comprobar si está inscrito en el curso
  let enrolled = false;

  if (isEnrolled !== undefined) {
    enrolled = isEnrolled; // Asignar el valor de isEnrolled directamente
  } else {
    enrolled = !!data4; // Convertir data4 a booleano (true o false)
  }

  // Renderizar solo si hay cursos
  if (countEnrolledCourses > 0) {
    return (
      <>
        {enrolled ? (
          <p className="my-0 text-xl font-semibold">Continue Learning...</p>
        ) : (
          <p className="my-0 text-xl font-semibold">Enroll to Course</p>
        )}

        <div className="z-10">
          <div className="flex flex-col bg-base-100 dark:bg-gray-800 rounded-3xl shadow-md border border-base-300 dark:border-gray-700 relative p-6">
            <div className="flex justify-between items-start mb-1">
              {/* Contenedor más grande para la imagen y el texto */}
              <div className="flex items-start flex-grow mr-4">
                <Image src={course.logo} alt={`${course.name} logo`} className="w-12 h-12 rounded-lg mr-4" />
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 overflow-hidden">
                    {course.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden">{course.description}</span>
                  <br />
                  <span className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden text-center mb-4 font-bold">
                    Provided by {course.provider}
                  </span>

                  {/* Tipo de curso en la esquina superior derecha */}
                  {!enrolled && (
                    <span className="absolute top-3 right-3 bg-gray-200 text-gray-800 text-xs rounded-full px-2 py-1">
                      {course.type} {/* Asume que `course.type` está en el objeto del curso */}
                    </span>
                  )}
                </div>
              </div>

              {/* Contenedor más pequeño para el progreso y el botón */}
              <div className="flex flex-col items-end md:items-start w-1/3">
                {enrolled && (
                  <>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${course.progress}%`, backgroundColor: "#ac21c2" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">{course.progress}% completado</span>
                  </>
                )}
                {/* Condicional para mostrar el botón */}
                {showButton && (
                  <Link
                    href={{
                      pathname: "/courseDetails",
                      query: {
                        id: course.id?.toString(),
                        title: course.name,
                        description: course.description,
                        provider: course.provider,
                      },
                    }}
                  >
                    <button className="btn btn-primary btn-sm">Continue</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null; // No renderizar nada si no hay cursos
};
