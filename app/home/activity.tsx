'use client';

import { Sparkle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Activity } from '../lib/activity';
import { fetchWithAuth } from '../lib/fetch';
import { useRouter } from 'next/navigation';

export default function PathActivity({ id, isActive, isDisabled, onSelect }: {
  id: string;
  isActive: boolean;
  isDisabled?: boolean;
  onSelect: (id: string) => void;
}) {

  const router = useRouter();

  const [activityData, setActivityData] = useState<Activity | null>(null)

  const radius: number = 54;
  const circumference: number = 2 * Math.PI * radius;
  // const dashOffset: number = circumference * (1 - 0 / 100);

  const fetchLearningPath = async () => {
    try {
      const response = await fetchWithAuth(`/api/PathStage/GetPathStageById?id=${id}`);
  
      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
      }
  
      const data: any = await response.json();
      console.log(data)
      setActivityData(data);
    } catch (error) {
      console.log(error);
    }
  };

  function splitCamelCase(str: string): string {
    return str.replace(/([A-Z])/g, ' $1').trim();
  }
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(id);
  };
  
  useEffect(() => {
    fetchLearningPath();
  }, [])

  return (
    <div className="peer relative inline-flex items-center transition-transform duration-300">
      <input 
        type="radio" 
        name="activity"
        className="absolute opacity-0 peer"
        checked={isActive}
        onChange={() => {}}
      />

      <div className="peer-checked:scale-130 transition-transform duration-300">
        <label
          className="relative flex items-center justify-center size-auto p-1 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-full cursor-pointer"
          onClick={handleClick}
        >
          {/* SVG Circle */}
          {/* <svg className="absolute inset-0 w-full h-full overflow-visible transition-all" viewBox="0 0 100 100">
            <circle 
              className="stroke-indigo-700 fill-none stroke-4 duration-500" 
              cx={50}
              cy={50}
              r={54}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
            />
          </svg> */}

          <Sparkle className="text-white size-12 m-8 transition-all" />
        </label>

        {isActive && (
          <div className="absolute z-30 left-full ml-4 top-1/2 -translate-y-1/2 animate-delayed-fade-in">
            <div className="relative bg-gradient-to-br from-blue-700 to-indigo-900 text-black p-3 rounded shadow-md">
              <div className='flex flex-col items-center justify-center gap-4'>
                <h3 className='text-white text-lg whitespace-nowrap'>{activityData && splitCamelCase(activityData.name)}</h3>
                <button onClick={() => router.push(`/activity/${id}`)} className='bg-white rounded text-black text-2xl font-bold px-8'>{activityData?.isCompleted ? 'Revisar' : 'Iniciar'}</button>
              </div>
              <div className="absolute left-[-8px] top-1/2 -translate-y-1/2">
                <div className="w-0 h-0 
                  border-t-[8px] border-t-transparent
                  border-r-[8px] border-r-blue-700
                  border-b-[8px] border-b-transparent" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}