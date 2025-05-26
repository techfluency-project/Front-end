'use client'

import { useEffect, useState } from "react";
import PathActivity from "./activity";
import Header from "../components/header";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../lib/fetch";

// shape of a single stage/activity
type ActivityData = {
  id: string;
  isCompleted: boolean;
};

// server returns this for each path
type LearningPath = {
  id: string;
  userId: string;
  name: string;
  description: string;
  level: number;
  stages: string[];
  dtCreated: string;
};

// internal structure: each path coupled with its fetched activities
type PathWithActivities = {
  path: LearningPath;
  activities: ActivityData[];
};

const Home = () => {
  const router = useRouter();

  // holds each learning path and its activities
  const [pathsList, setPathsList] = useState<PathWithActivities[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetchLearningPaths = async () => {
    try {
      const response = await fetchWithAuth("/api/LearningPath/GetLearningPath");
      if (!response.ok) throw new Error("Network response was not ok");

      const paths: LearningPath[] = await response.json();
      if (!paths || paths.length === 0) {
        router.push("/activity");
        return;
      }

      // for each path, fetch its stage details
      const list = await Promise.all(
        paths.map(async (path) => {
          const activities = await Promise.all(
            path.stages.map(async (stageId) => {
              const res = await fetchWithAuth(
                `/api/PathStage/GetPathStageById?id=${stageId}`
              );
              if (!res.ok) {
                console.error(`Failed to load stage ${stageId}`);
                return { id: stageId, isCompleted: false } as ActivityData;
              }
              const data = await res.json();
              return { id: data.id, isCompleted: data.isCompleted } as ActivityData;
            })
          );
          return { path, activities } as PathWithActivities;
        })
      );

      setPathsList(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  useEffect(() => {
    // default active to first stage of first path
    if (!activeId && pathsList.length > 0) {
      const firstActivities = pathsList[0].activities;
      if (firstActivities.length > 0) {
        setActiveId(firstActivities[0].id);
      }
    }
  }, [pathsList, activeId]);

  return (
    <>
      <Header />
      <div className="container flex flex-col items-center mx-auto px-4 py-8 bottom-0 mt-20">
        {/* iterate over each learning path */}
        {pathsList.slice().reverse().map(({ path, activities }) => (
          <section key={path.id} className="mb-8 relative">
            <div className="absolute flex flex-col justify-center bottom-0 h-36 -left-80 max-w-64">
              <h2 className="text-2xl font-semibold mb-2">{path.name}</h2>
              <p className="text-gray-600">{path.description}</p>
            </div>
            <div className="flex flex-col-reverse thin-scrollbar gap-8">
              {activities.map((activity, idx) => {
                const previousCompleted =
                  idx === 0 || activities[idx - 1].isCompleted;
                return (
                  <PathActivity
                    key={activity.id}
                    id={activity.id}
                    isActive={activeId === activity.id}
                    onSelect={setActiveId}
                    isDisabled={!previousCompleted}
                    isCompleted={activity.isCompleted}
                  />

                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default Home;
