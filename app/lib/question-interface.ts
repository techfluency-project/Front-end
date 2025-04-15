export default interface QuestionInterface {
  id: string;
  questionText: string;
  level: number;
  type: number;
  topic: number;
  options: string[];
  correctAnswer: string;
  pairs: [string, string][] | null;
  correctAnswerForPairs: string[] | null;
  shuffledWords: string[] | null;
  correctAnswerForShuffled: string[] | null;
  audio: string | null;
}