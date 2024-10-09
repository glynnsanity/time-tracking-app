'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Activity, Timer } from '../types';

interface ActivityInputProps {
  timer: Timer;
  activity: Activity;
  handleUpdateActivity: (newTime: number) => void;
}

function ActivityInput({ timer, activity, handleUpdateActivity }: ActivityInputProps) {
  const [inputValue, setInputValue] = useState<string>(activity.time.toFixed(2));
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  useEffect(() => {
    setInputValue(activity.time.toFixed(2));
  }, [activity.time]);

  const debouncedHandleUpdateActivity = useCallback(
    debounce((value: number) => {
      handleUpdateActivity(value);
    }, 300),
    [handleUpdateActivity]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsInvalid(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateActivityTime();
    }
  };

  const handleBlur = () => {
    updateActivityTime();
  };

  const updateActivityTime = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      const roundedValue = parseFloat(value.toFixed(2));
      if (roundedValue !== activity.time) {
        debouncedHandleUpdateActivity(roundedValue);
      }
    } else {
      setInputValue(activity.time.toFixed(2));
      setIsInvalid(true);
    }
  };

  return (
    <div>
      <input
        type="number"
        step="0.01"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
        disabled={timer.isActive}
        className={`border rounded py-1 px-2 w-16 md:w-20 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isInvalid ? 'border-red-500' : ''
        }`}
        aria-label={`Edit time for ${activity.name}`}
      />
      {isInvalid && <p className="text-red-500 text-xs mt-1">Invalid input</p>}
    </div>
  );
}

export default React.memo(ActivityInput);