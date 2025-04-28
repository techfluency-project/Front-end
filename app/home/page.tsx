'use client'

import { useEffect, useState } from "react";
import PathActivity from "./activity"

const Home = () => {

  const [activeId, setActiveId] = useState<string | null>(null);

  const activities = [
    { id: '1', progress: 100 },
    { id: '2', progress: 100 },
    { id: '3', progress: 45 },
    { id: '4', progress: 0 },
    { id: '5', progress: 0 },
  ];

  useEffect(() => {
    if (!activeId && activities.length > 0) {
      setActiveId(activities[0].id);
    }
  }, [activeId, activities]);

  const handleSelect = (id: string) => {
    setActiveId(id);
  };

  return (
    <div className="flex justify-center h-full">
      <div className="w-[656px] flex items-center thin-scrollbar flex-col-reverse gap-10 pb-20 mt-16 overflow-y-scroll overflow-x-visible">
        
      {activities.map((activity) => (
        <PathActivity
          key={activity.id}
          id={activity.id}
          isActive={activeId === activity.id}
          progress={activity.progress}
          onSelect={setActiveId}
        />
      ))}

      </div>
    </div>
  )
}

export default Home