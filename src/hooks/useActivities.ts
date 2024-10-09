import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from '@/types';

const LOCAL_STORAGE_KEY = 'timeTrackingActivities';

const getStoredActivities = (): Activity[] => {
  if (typeof window !== 'undefined') {
    const savedActivities = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedActivities ? JSON.parse(savedActivities) : [];
  }
  return [];
};

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Set initial state from localStorage on client-side after first render
    setActivities(getStoredActivities());
  }, []);

  useEffect(() => {
    // Save to localStorage whenever activities change
    if (typeof window !== 'undefined' && activities.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities]);

  const addActivity = useCallback(() => {
    const newActivity: Activity = {
      id: uuidv4(),
      name: 'New Activity',
      time: 0,
      running: false,
      start: null,
    };
    setActivities(prev => [...prev, newActivity]);
  }, []);

  const editActivityName = useCallback((id: string, newName: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, name: newName } : activity
    ));
  }, []);

  const toggleActivityRunning = useCallback((id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id
        ? { ...activity, running: !activity.running, start: !activity.running ? Date.now() : null }
        : activity
    ));
  }, []);

  const clearActivityTime = useCallback((id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, time: 0 } : activity
    ));
  }, []);

  const editActivityTime = useCallback((id: string, newTime: number) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, time: newTime } : activity
    ));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  }, []);

  const isAnyRunning = activities.some(activity => activity.running);

  return {
    activities,
    setActivities,
    addActivity,
    editActivityName,
    toggleActivityRunning,
    clearActivityTime,
    editActivityTime,
    deleteActivity,
    isAnyRunning,
  };
}