"use client";

import React, { memo } from 'react';
import { Activity, Timer } from '../types';
import ActivityInput from './ActivityInput';

interface ActivityItemProps {
  activity: Activity;
  timer: Timer;
  onEditName: (id: string, newName: string) => void;
  onStartStop: (id: string) => void;
  onClearTime: (id: string) => void;
  onEditTime: (id: string, newTime: number) => void;
  onDeleteActivity: (id: string) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = memo(({
  activity,
  timer,
  onEditName,
  onStartStop,
  onClearTime,
  onEditTime,
  onDeleteActivity,
}) => {
  return (
    <div
      className={`mb-4 p-4 border rounded-lg shadow-md ${
        activity.running ? 'bg-green-100' : timer.isActive ? 'bg-gray-200 opacity-50' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-start justify-between md:justify-start md:flex-1">
          <div className="flex-1 mr-2">
            <input
              type="text"
              value={activity.name}
              onChange={(e) => onEditName(activity.id, e.target.value)}
              className="text-xl font-semibold mb-2 border-b-2 focus:outline-none bg-transparent w-full"
              disabled={activity.running}
              aria-label={`Edit name for ${activity.name}`}
            />
            <p className="text-base">Time: {activity.time.toFixed(2)} minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onStartStop(activity.id)}
            aria-label={`${activity.running ? 'Stop' : 'Start'} ${activity.name}`}
          >
            {activity.running ? 'Stop' : 'Start'}
          </button>
          <ActivityInput
            timer={timer}
            activity={activity}
            handleUpdateActivity={(newTime) => onEditTime(activity.id, newTime)}
          />
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onClearTime(activity.id)}
            disabled={timer.isActive && !activity.running}
            aria-label={`Clear time for ${activity.name}`}
          >
            Clear
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onDeleteActivity(activity.id)}
            disabled={activity.running}
            aria-label={`Delete ${activity.name}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

export default ActivityItem;