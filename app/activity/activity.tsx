'use client';

import { use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchWithAuth } from '../lib/fetch';
import { X } from 'lucide-react';
import Question from './question';

export interface UserTestDataInterface {
  questionId: string;
  selectedOption: string;
}

export interface ResultInterface {
  message: string;
  level: string;
}

type ActivityProps = {
  mode: "placement" | "single";
  activityId?: string;
};

function Activity(_: ActivityProps) {
  const { activityId } = useParams();           
  const router         = useRouter();

  const isPlacementMode = !activityId;       

  const [correctAnswersPercent, setCorrectAnswersPercent] = useState<number | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [progress,  setProgress]  = useState(0);

  const [showFinishModal, setShowFinishModal] = useState(false);

  const [userAnswers, setUserAnswers] = useState<UserTestDataInterface[]>([]);
  const [results, setResults]         = useState<ResultInterface | null>(null);

  useEffect(() => {
    const load = async () => {
      const url = isPlacementMode
        ? '/api/PlacementTest/GetQuestionsForPlacementTest'
        : `/api/PathStage/GetPathStageById?id=${activityId}`;
  
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to load');
  
      const data = await res.json();
  
      if (isPlacementMode) {
        setQuestions(data);
      } else {
        const questionIds = data.questions;
  
        const questionPromises = questionIds.map((id: string) =>
          fetchWithAuth(`/api/Question/GetQuestionById?id=${id}`).then(r => r.json())
        );
  
        const fullQuestions = await Promise.all(questionPromises);
        setQuestions(fullQuestions);
      }
    };
  
    load().catch(console.error);
  }, [activityId, isPlacementMode]);
  
  

  const finish = async () => {
    if (isPlacementMode) {
      const placementRes = await fetchWithAuth('/api/PlacementTest/ResultFromPlacementTest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userAnswers),
      }).then(r => r.json());
  
      const pathRes = await fetchWithAuth('/api/LearningPath/MountLearningPaths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userAnswers),
      }).then(r => r.json());
  
      setResults({
        message: pathRes.message,
        level:   placementRes.level,
      });
    } else {
      // Submit each answer for non-placement activities
      await Promise.all(
        userAnswers.map(answer =>
          fetchWithAuth('/api/Question/QuestionAnswer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionId: answer.questionId,
              selectedOption: answer.selectedOption,
              pathStageId: activityId,
            }),
          })
        )
      );
      router.push('/home');
    }
  };

  useEffect(() => {
    console.log(correctAnswersPercent)
  }, [correctAnswersPercent])

  const nextQuestion = async () => {
    if (progress >= questions.length - 1) {
      // Calculate the percent of correct answers
      const correct = userAnswers.reduce((count, answer) => {
        const question = questions.find(q => q.id === answer.questionId);
        return count + (question?.correctAlternativeId === answer.selectedOption ? 1 : 0);
      }, 0);
  
      await setCorrectAnswersPercent(Math.round((correct / questions.length) * 100));
      setShowFinishModal(true);
    } else {
      setProgress(p => p + 1);
    }
  };
  

  if (showFinishModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/60">
        <div className="bg-white rounded-2xl shadow-2xl w-1/3 p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">You’ve finished all questions!</h2>
          <p className="mt-4 text-gray-600">
            You answered <span className="font-semibold text-blue-700">{correctAnswersPercent}%</span> of the questions correctly.
          </p>
          <p className="mt-2 text-gray-600">
            Are you ready to finish this activity?
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <button
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
              onClick={() => finish()}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  if (results) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/60">
        <div className="bg-white rounded-2xl shadow-2xl w-1/3 p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Your English Level</h2>
          <p className="mt-2 text-lg font-semibold text-blue-600">{results.level}</p>
          <p className="mt-4 text-gray-600">
            Great job! Based on your answers, you are currently at the&nbsp;
            <span className="font-medium text-blue-600">{results.level}</span> level.
          </p>
          <div className="mt-6">
            <button
              className="max-h-20 flex items-center justify-center rounded-2xl text-white w-full bg-gradient-to-br from-blue-700 to-indigo-900 p-6 transition-all hover:scale-105"
              onClick={() => router.push('/home')}
            >
              Go to Your Learning Path
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <p className="mt-10 text-center">Loading…</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-3 items-center mb-6 mt-10">
        <button onClick={() => setProgress(0)}><X /></button>
        <div className="w-[620px] h-3 rounded-lg bg-gray-300">
          <div
            className="h-full rounded-lg bg-blue-700 transition-all"
            style={{
              width: `${100 * (progress) / questions.length}%`
            }}
          />
        </div>
      </div>

      <Question
        userAnswers={userAnswers}
        QuestionData={questions[progress]}
        nextQuestion={nextQuestion}
        setUserAnwers={setUserAnswers}
      />
    </div>
  );
}

export default Activity
