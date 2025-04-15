import { useEffect, useState } from "react"
import QuestionInterface from "../lib/question-interface"
import QuestionOption from "./option"

interface QuestionProps {
  QuestionData: QuestionInterface
  nextQuestion: () => void
}

const Question = ({
  QuestionData,
  nextQuestion
}: QuestionProps) => {

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    setTimeout(() => {
      nextQuestion();
      setSelectedOption(null)
    }, 1000);
  };

  return (
    <>
    
      <div className="w-[332px] space-y-5">
        <p className="flex font-extrabold min-h-4 text-md">{QuestionData.questionText}</p>

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

    </>
  )
}

export default Question