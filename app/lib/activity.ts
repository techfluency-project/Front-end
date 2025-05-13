export interface Activity {
  id: string;
  name: string;
  topic: number;
  xpReward: number;
  isCompleted: boolean;
  dtCreated: string;
  learningPathId: string;
  questions: string[];
}
