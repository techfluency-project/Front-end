'use client'

import { Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"
import QuestionInterface from "../lib/question-interface"
import Question from "./question"
import { useRouter } from 'next/navigation'

export interface UserTestDataInterface {
  questionId: string;
  selectedOption: string
}

export interface resultInterface {
  message: string;
  level: string
}

const Activity = () => {

  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [activityLength, setActivityLength] = useState<number>(0)
  const [userAnswers, setUserAnwers] = useState<UserTestDataInterface[]>([])
  const [activity, setActivity] = useState<QuestionInterface[] | null>(null)
  const [resultsData, setResultsData] = useState<resultInterface | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch("http://localhost:5092/api/PlacementTest")
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
        const data: any = await response.json();
        setActivityLength(data.length)
        setActivity(data)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    };

    fetchActivity();
  }, [])

  const sendResults = async (userAnswers: UserTestDataInterface[]) => {
    try {
      const response = await fetch("http://localhost:5092/api/PlacementTest/ResultFromPlacementTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userAnswers),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data)
      setResultsData(data)
    } catch (error) {
      console.error("Error sending answers:", error);
    }
  };

  const nextQuestion = () => {
    if(progress == activityLength - 1) {
      sendResults(userAnswers)
      return
    }
    setProgress(progress+1)
    return
  }   
  
  var barPercentage = (100 * (progress)) / activityLength

  return (
    <>

      {activity ? (
        <div className='flex flex-col items-center'>
          <div className="flex gap-3 items-center mb-6 mt-10">
            <X className="transition-all hover:scale-130" onClick={() => setProgress(0)} />
            <div className="w-[620px] h-3 rounded-lg bg-gray-300">
              <div className="min-w-5 h-full rounded-lg bg-blue-700 transition-all" style={{ width: `${!resultsData ? barPercentage : "100"}%` }} />
            </div>
          </div>
          <Question
            userAnswers={userAnswers}
            QuestionData={activity[progress]}
            nextQuestion={nextQuestion}
            setUserAnwers={setUserAnwers}
          />
        </div>
      ) : (
        <div className="flex size-full items-center justify-center">
          <Loader2 className="animate-spin"/>
        </div>
      )}

      {resultsData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/60">
          <div className="bg-white rounded-2xl shadow-2xl w-1/3 p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Your English Level</h2>
            
            <p className="mt-2 text-lg font-semibold text-blue-600">
              {resultsData.level}
            </p>
    
            <p className="mt-4 text-gray-600">
              Great job! Based on your answers, you are currently at the <span className="font-medium text-blue-600">{resultsData.level}</span> level. Let's keep learning!
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
      )}

    </>
  )
}

export default Activity