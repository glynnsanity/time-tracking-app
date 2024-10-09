import React from 'react';
import ActivityItem from './ActivityItem';
import { Activity, Timer } from '@/types';

interface ActivityListProps {
  activities: Activity[];
  timer: Timer;
  onEditName: (id: string, newName: string) => void;
  onStartStop: (id: string) => void;
  onClearTime: (id: string) => void;
  onEditTime: (id: string, newTime: number) => void;
  onDeleteActivity: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  timer,
  onEditName,
  onStartStop,
  onClearTime,
  onEditTime,
  onDeleteActivity,
}) => {

  if (activities.length === 0) {
    return <div>No activities yet. Add one to get started!</div>;
  }
  
  return (
    <div>
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          timer={timer}
          onEditName={onEditName}
          onStartStop={onStartStop}
          onClearTime={onClearTime}
          onEditTime={onEditTime}
          onDeleteActivity={onDeleteActivity}
        />
      ))}
    </div>
  );
};

export default ActivityList;