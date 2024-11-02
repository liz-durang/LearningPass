// Evaluation.tsx
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface EvaluationProps {
  courseId: string;
}

const Evaluation: React.FC<EvaluationProps> = ({ courseId }) => {
  const [mappedQuestions, setMappedQuestions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number | null }>({});
  const [evaluationCompleted, setEvaluationCompleted] = useState<boolean | null>(null);

  const { address: connectedAddress } = useAccount();
  const { writeContractAsync: writeQuestionManagerAsync } = useScaffoldWriteContract("QuestionManager");
  const { writeContractAsync: writeCourseManagerAsync } = useScaffoldWriteContract("CourseManager");

  // Obtener detalles del curso
  const { data: dataCourseDetails } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getCourseDetails",
    args: [BigInt(courseId)],
  });

  const courseDetails = dataCourseDetails || [];

  // Obtener id de preguntas del curso
  const { data: dataQuestionId } = useScaffoldReadContract({
    contractName: "CourseManager",
    functionName: "getCourseQuestions",
    args: [BigInt(courseId)],
  });

  const questionIds = dataQuestionId || [];

  // Obtener detalles de preguntas del curso
  const { data: dataQuestions } = useScaffoldReadContract({
    contractName: "QuestionManager",
    functionName: "getQuestionsDetails",
    args: [questionIds],
  });

  const questionsDetails = dataQuestions || [];

  // Obtener respuestas de preguntas
  const { data: dataAnswer } = useScaffoldReadContract({
    contractName: "QuestionManager",
    functionName: "getUserAnswers",
    args: [questionIds, connectedAddress],
  });

  const answerDetails = dataAnswer || [];

  // Mapeo de las preguntas
  useEffect(() => {
    if (questionsDetails.length > 0) {
      const mapped =
        questionsDetails[0]?.map((questionText: string, index: number) => {
          const options = questionsDetails[1]?.[index] || [];
          const correctAnswerIndex = questionsDetails[2]?.[index];
          const correctAnswer = correctAnswerIndex !== undefined ? Number(correctAnswerIndex) : null;
          const id = questionsDetails[3]?.[index];

          return {
            question: questionText,
            options: options,
            correctAnswer: correctAnswer,
            id: id,
          };
        }) || [];

      setMappedQuestions(mapped);
    }
  }, [questionsDetails]);

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const saveAnswers = async () => {
    for (const [index, selectedOption] of Object.entries(selectedOptions)) {
      if (selectedOption !== null) {
        try {
          await writeQuestionManagerAsync({
            functionName: "saveUserAnswer",
            args: [BigInt(questionIds[Number(index)]), BigInt(selectedOption), connectedAddress],
          });
        } catch (e) {
          console.error("Error al enviar respuesta:", e);
        }
      }
    }
    await reviewResults();
  };

  const reviewResults = async () => {
    let allCorrect = true;

    for (const [index, answer] of answerDetails.entries()) {
      const correctAnswer = mappedQuestions[index]?.correctAnswer;
      const answerString = answer.toString();

      if (answerString !== correctAnswer?.toString()) {
        allCorrect = false;
      }
    }

    setEvaluationCompleted(allCorrect);
    await finishEvaluation();
  };

  const finishEvaluation = async () => {
    if (evaluationCompleted) {
      console.log("completed!");
      try {
        await writeCourseManagerAsync({
          functionName: "finishCourse",
          args: [BigInt(courseId), connectedAddress],
        });
        console.log("completado");
      } catch (e) {
        console.error("Error", e);
      }
    }
  };

  return (
    <>
      {courseDetails.length > 0 ? (
        <ul>
          {mappedQuestions.map((questionDetail, index) => (
            <li key={index}>
              <div className="flex flex-col px-5 py-2 bg-white rounded-lg shadow-md w-full border mb-5">
                <p className="text-lg font-medium text-gray-800 overflow-hidden">{questionDetail.question}</p>
                <div className="pl-4 pb-3">
                  {questionDetail.options.map((option: string, optionIndex: number) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`question-${index}-option-${optionIndex}`}
                        checked={selectedOptions[index] === optionIndex}
                        onChange={() => handleOptionChange(index, optionIndex)}
                        className="mr-2"
                      />
                      <label htmlFor={`question-${index}-option-${optionIndex}`} className="text-gray-600">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
          {questionIds.length > 0 && (
            <div className="flex justify-end">
              <button onClick={saveAnswers} className="btn btn-primary btn-sm">
                Submit Evaluation
              </button>
            </div>
          )}

          {evaluationCompleted === false && (
            <div className="mt-4 p-3">
              <p className="text-red-500">Some answers are incorrect</p>
            </div>
          )}

          {evaluationCompleted === true && (
            <div className="mt-4 p-3">
              <p className="text-green-500">Evaluation successfully completed!</p>
            </div>
          )}
        </ul>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-md w-full h-24 border">
          <p className="text-center text-lg font-medium text-gray-500">There are no courses registered yet</p>
        </div>
      )}
    </>
  );
};

export default Evaluation;
