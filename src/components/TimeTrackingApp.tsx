'use client';

import React from 'react';
import ActivityList from '@/components/ActivityList';
import AddActivityButton from '@/components/AddActivityButton';
import { useActivities } from '@/hooks/useActivities';
import { useTimer } from '@/hooks/useTimer';

const TimeTrackingApp: React.FC = () => {
  const {
    activities,
    setActivities,
    addActivity,
    editActivityName,
    toggleActivityRunning,
    clearActivityTime,
    editActivityTime,
    deleteActivity,
    isAnyRunning,
  } = useActivities();

  const { timer, startTimer, stopTimer } = useTimer(activities, setActivities);

  const handleStartStop = (id: string) => {
    toggleActivityRunning(id);
    if (!isAnyRunning) {
      startTimer();
    } else if (activities.every((activity) => activity.id === id || !activity.running)) {
      stopTimer();
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Time Tracking App</h1>
      <ActivityList
        activities={activities}
        timer={timer}
        onEditName={editActivityName}
        onStartStop={handleStartStop}
        onClearTime={clearActivityTime}
        onEditTime={editActivityTime}
        onDeleteActivity={deleteActivity}
      />
      <AddActivityButton onAddActivity={addActivity} />
    </div>
  );
};

export default TimeTrackingApp;