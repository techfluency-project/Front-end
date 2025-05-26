'use client';

import { Lock, Check, Sparkle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Activity } from '../lib/activity';
import { fetchWithAuth } from '../lib/fetch';
import { useRouter } from 'next/navigation';

export default function PathActivity({
  id,
  isActive,
  isDisabled,
  isCompleted,
  onSelect
}: {
  id: string;
  isActive: boolean;
  isDisabled?: boolean;
  isCompleted?: boolean;
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const [activityData, setActivityData] = useState<Activity | null>(null);

  const fetchLearningPath = async () => {
    try {
      const response = await fetchWithAuth(`/api/PathStage/GetPathStageById?id=${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: any = await response.json();
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
    if (!isDisabled) onSelect(id);
  };

  useEffect(() => {
    fetchLearningPath();

    // Auto-select if not disabled and not completed
    if (!isDisabled && !isCompleted) {
      onSelect(id);
    }
  }, []);

  const baseClasses = `relative flex items-center justify-center size-auto p-1 rounded-full cursor-pointer transition-colors`;
  const bgClasses = isDisabled
    ? 'bg-gray-400'
    : isCompleted
    ? 'bg-gradient-to-br from-yellow-500 to-yellow-700'
    : 'bg-gradient-to-br from-blue-700 to-indigo-900';
    
  const baseColor = isDisabled
    ? '#9CA3AF'  // gray-400
    : isCompleted
    ? '#F59E0B'  // yellow-500
    : '#1D4ED8'; // blue-700

  const icon = isDisabled ? <Lock className="text-white size-12 m-8" /> :
              isCompleted ? <Check className="text-white size-12 m-8" /> :
              <Sparkle className="text-white size-12 m-8" />;

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
          className={`${baseClasses} ${bgClasses} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleClick}
        >
          {icon}
        </label>

        {isActive && !isDisabled && (
          <div className="absolute z-30 left-full ml-4 top-1/2 -translate-y-1/2 animate-delayed-fade-in">
            <div className={`${bgClasses} text-black p-3 rounded shadow-md`}>
              <div className='flex flex-col items-center justify-center gap-4'>
                <h3 className='text-white text-lg whitespace-nowrap'>
                  {activityData && splitCamelCase(activityData.name)}
                </h3>
                <button
                  onClick={() => router.push(`/activity/${id}`)}
                  className='bg-white rounded text-black text-2xl font-bold px-8'
                >
                  {activityData?.isCompleted ? 'Revisar' : 'Iniciar'}
                </button>
              </div>
              <div className="absolute left-[-8px] top-1/2 -translate-y-1/2">
                <div
                  className="w-0 h-0 
                    border-t-[8px] border-t-transparent
                    border-r-[8px]
                    border-b-[8px] border-b-transparent"
                  style={{ borderRightColor: baseColor }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
