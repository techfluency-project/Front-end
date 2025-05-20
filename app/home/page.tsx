'use client'

import { useEffect, useState } from "react";
import PathActivity from "./activity"
import Header from "../components/header";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../lib/fetch";

const Home = () => {

  const router = useRouter()

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityData[]>([]);

  type ActivityData = {
    id: string;
    isCompleted: boolean;
  };

  const fetchLearningPathActivity = async () => {
    try {
      const response = await fetchWithAuth("/api/LearningPath/GetLearningPath");
  
      if (!response.ok) throw new Error("Network response was not ok");
  
      const data = await response.json();
  
      if (!data.result) {
        router.push("/activity");
        return;
      }
  
      // Then fetch each activity data
      const activityIds: string[] = data.result.stages;
      const activityPromises = activityIds.map(id =>
        fetchWithAuth(`/api/PathStage/GetPathStageById?id=${id}`)
          .then(res => res.json())
          .then(data => data) // Adjust if your API returns wrapped data
      );
  
      const fullActivities = await Promise.all(activityPromises);
      setActivities(fullActivities);
  
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLearningPathActivity();
  }, [])

  useEffect(() => {
    if(activities){
      if (!activeId && activities.length > 0) {
        setActiveId(activities[0].id);
      }
    }
  }, [activeId, activities]);

  return (
    <>
    
      {activities && 
      <>
        <Header />
        <div className="flex justify-center h-full">
          <div className="w-[656px] flex items-center thin-scrollbar flex-col-reverse gap-10 pb-16 mt-24 overflow-visible">
            
          {activities.map((activity, index) => {
            const previousCompleted = index === 0 || activities[index - 1].isCompleted;

            return (
              <PathActivity
                key={activity.id}
                id={activity.id}
                isActive={activeId === activity.id}
                onSelect={setActiveId}
                isDisabled={!previousCompleted}
              />
            );
          })}

          </div>
        </div>
      </>}

    </>
  )
}

export default Home