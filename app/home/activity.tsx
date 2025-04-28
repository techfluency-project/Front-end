'use client';

import { Sparkle } from 'lucide-react';
import { useState } from 'react';

export default function PathActivity({ id, isActive, progress, onSelect }: {
  id: string;
  isActive: boolean;
  progress: number;
  onSelect: (id: string) => void;
}) {
  const radius: number = 54;
  const circumference: number = 2 * Math.PI * radius;
  const dashOffset: number = circumference * (1 - progress / 100);

  const handleClick = () => {
    onSelect(id);
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Main Label */}
      <label
        className="relative flex items-center justify-center size-auto p-1 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-full transition-all cursor-pointer overflow-visible"
        onClick={handleClick}
      >
        <input 
          type="radio" 
          name="activity"
          className="peer hidden"
          checked={isActive}
          onChange={() => {}} // Needed to suppress React warning
        />

        {/* SVG Circle */}
        <svg className="absolute inset-0 w-full h-full overflow-visible transition-all" viewBox="0 0 100 100">
          <circle 
            className="stroke-indigo-700 fill-none stroke-4 duration-500" 
            cx={50}
            cy={50}
            r={54}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Inner Content */}
        <Sparkle className="text-white size-12 m-8 peer-checked:m-12 peer-checked:size-24 transition-all" />
      </label>

      {/* Right Absolute Element - Only visible when active */}
      {isActive && (
        <div className="absolute left-[240px] top-1/2 -translate-y-1/2 animate-delayed-fade-in">
          <div className="relative bg-gradient-to-br from-blue-700 to-indigo-900 text-black p-3 rounded shadow-md">
            {/* Bubble content */}
            <div className='flex flex-col items-center justify-center gap-4'>

              <h3 className='text-white text-lg whitespace-nowrap'>Activity Name</h3>
              <button className='bg-white rounded text-black text-2xl font-bold px-8'>Iniciar</button>

            </div>
            
            {/* Arrow pointing left */}
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
  );
}