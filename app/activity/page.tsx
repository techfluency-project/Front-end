'use client'

import { Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"
import QuestionInterface from "../lib/question-interface"
import Question from "./question"

export interface UserTestDataInterface {
  questionId: string;
  selectedOption: string
}

const Activity = () => {

  const [progress, setProgress] = useState(0)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [activityLength, setActivityLength] = useState<number>(0)
  const [userAnswers, setUserAnwers] = useState<UserTestDataInterface[]>([])
  const [activity, setActivity] = useState<QuestionInterface[] | null>(null)

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
      const response = await fetch("http://localhost:5092/api/PlacementTest/GetResultFromPlacementTest", {
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
      console.log(data);
    } catch (error) {
      console.error("Error sending answers:", error);
    }
  };


  const nextQuestion = () => {
    if(progress == activityLength - 1) {
      sendResults(userAnswers)
      console.log(userAnswers)
      return
    }
    setProgress(progress+1)
    return
  } 
  
  var barPercentage = (100 * (progress)) / activityLength

  return (
    <>

      {activity ? (
        <>
          <div className="flex gap-3 items-center mb-6 mt-10">
            <X className="transition-all hover:scale-130" onClick={() => setProgress(0)} />
            <div className="w-[620px] h-3 rounded-lg bg-gray-300">
              <div className="min-w-5 h-full rounded-lg bg-blue-700 transition-all" style={{ width: `${barPercentage}%` }} />
            </div>
          </div>
          <Question
            QuestionData={activity[progress]}
            nextQuestion={nextQuestion}
            setUserAnwers={setUserAnwers}
          />
        </>
      ) : (
        <div className="flex size-full items-center justify-center">
          <Loader2 className="animate-spin"/>
        </div>
      )}

    </>
  )
}

export default Activity