import { useEffect, useState } from "react"
import QuestionInterface from "../lib/question-interface"
import QuestionOption from "./option"
import { UserTestDataInterface } from "./activity"

interface QuestionProps {
  userAnswers: UserTestDataInterface[]
  QuestionData: QuestionInterface
  nextQuestion: () => void
  setUserAnwers: React.Dispatch<React.SetStateAction<UserTestDataInterface[]>>
}

const Question = ({
  userAnswers,
  QuestionData,
  nextQuestion,
  setUserAnwers
}: QuestionProps) => {

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    setTimeout(() => {
      const newAnswer: UserTestDataInterface = {
        questionId: QuestionData.id,
        selectedOption: option
      };
      setUserAnwers(prevAnswers => [...prevAnswers, newAnswer]);

      setSelectedOption(null)
    }, 500);
  };

  useEffect(() => {
    if(userAnswers.length > 0) {
      nextQuestion();
    }
  }, [userAnswers])

  return (
    <>
    
      {QuestionData.options && 
        <div className="w-[500px] space-y-12">
          <p className="flex font-extrabold min-h-4 text-3xl">{QuestionData.questionText}</p>

          <div className="grid grid-cols-1 gap-2 w-full">
            
            {QuestionData.options.map((option, index) => 
              <QuestionOption 
                key={index} 
                option={option}
                onSelect={handleSelect}
                isLocked={!!selectedOption}
                selectedOption={selectedOption}
                correctOption={QuestionData.correctAnswer}
              />
            )}
            
          </div>
        </div>
      }

    </>
  )
}

export default Question