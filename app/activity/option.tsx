interface QuestionOptionProps {
  option: string;
  correctOption: string;
  isLocked: boolean;
  onSelect: (option: string) => void;
  selectedOption: string | null
}

const QuestionOption = ({
  option,
  correctOption,
  isLocked,
  onSelect,
  selectedOption
}: QuestionOptionProps) => {
  const isCorrect = option === correctOption;

  return (
    <label className={`cursor-pointer ${isLocked ? 'pointer-events-none opacity-70' : ''}`}>
      <input
        type="radio"
        name="option"
        value={option}
        disabled={isLocked}
        className="peer hidden"
        onChange={() => onSelect(option)}
        checked={selectedOption === option}
      />

      <div
        className={`
          max-h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br 
          from-blue-700 to-indigo-900 p-6 transition-all 
          hover:scale-105 
          peer-checked:from-${isCorrect ? "green-700" : "red-700"} 
          peer-checked:to-${isCorrect ? "green-900" : "red-900"}
          peer-checked:hover:from-${isCorrect ? "green-700" : "red-700"} 
          peer-checked:hover:to-${isCorrect ? "green-900" : "red-900"}
        `}
      >
        <span className="capitalize text-white font-bold">{option}</span>
      </div>
    </label>
  );
};

export default QuestionOption;
