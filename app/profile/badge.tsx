import { useEffect, useState } from "react";
import { Medal } from "lucide-react";

interface BadgeProps {
  id: string;
  progress: number; // from 0 to goal (you’ll calculate percentage)
}

interface BadgeData {
  id: string;
  title: string;
  description: string;
  icon: string;
  goal: number;
  topic: number;
}

const Badge = ({ id, progress }: BadgeProps) => {
  const [badge, setBadge] = useState<BadgeData | null>(null);

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const res = await fetch(`http://localhost:5092/api/Badge/GetBadgeById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch badge");
        }

        const data = await res.json();
        setBadge(data);
      } catch (err) {
        console.error("Error fetching badge:", err);
      }
    };

    fetchBadge();
  }, [id]);

  if (!badge) {
    return <div className="text-gray-400 italic">Loading badge...</div>;
  }

  const progressPercent = badge.goal > 0 ? Math.min((progress / badge.goal) * 100, 100) : 0;

  return (
    <div className="flex w-full gap-4">
      <div className="rounded-full bg-gray-100 p-6">
        <Medal className="text-blue-700 size-10" />
      </div>
      <div className="flex flex-col w-full justify-around">
        <h4 className="text-xl font-bold">{badge.title}</h4>
        <div className="h-4 rounded-2xl w-full bg-gray-100 my-1">
          <div
            className="h-full bg-blue-700 rounded-2xl"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span>{badge.description}</span>
      </div>
    </div>
  );
};

export default Badge;
