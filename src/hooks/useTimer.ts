// app/time-tracking/hooks/useTimer.ts
import { useState, useEffect, useCallback } from 'react';
import { Timer, Activity } from '@/types';

export function useTimer(activities: Activity[], setActivities: React.Dispatch<React.SetStateAction<Activity[]>>) {
  const [timer, setTimer] = useState<Timer>({ id: null, isActive: false });

  useEffect(() => {
    if (timer.isActive) {
      const timerId = setInterval(() => {
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.running
              ? { ...activity, time: activity.time + 1 / 60 }
              : activity
          )
        );
      }, 1000);
      setTimer(prevTimer => ({ ...prevTimer, id: timerId }));
    } else if (timer.id !== null) {
      clearInterval(timer.id);
      setTimer({ id: null, isActive: false });
    }
    return () => {
      if (timer.id !== null) {
        clearInterval(timer.id);
      }
    };
  }, [timer.isActive, setActivities]);

  const startTimer = useCallback(() => {
    setTimer((prevTimer) => ({ ...prevTimer, isActive: true }));
  }, []);

  const stopTimer = useCallback(() => {
    setTimer((prevTimer) => ({ ...prevTimer, isActive: false }));
  }, []);

  return { timer, startTimer, stopTimer };
}