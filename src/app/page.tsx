// app/(root)/page.tsx
"use client";
import { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

// Define the structure for an activity
interface Activity {
  name: string; // Name of the activity
  time: number; // Time spent on the activity in minutes
  running: boolean; // Indicates if the timer is currently running
  start: number | null; // Timestamp when the timer started, or null if not running
}

export default function Home() {
  // Initialize state for activities, set to null initially to prevent hydration issues
  const [activities, setActivities] = useState<Activity[] | null>(null);

  // Load activities from localStorage once the component has mounted
  useEffect(() => {
    const storedActivities = localStorage.getItem('activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      // Initialize with default activities if not found in localStorage
      setActivities(Array(10).fill(null).map((_, i) => ({ name: `Activity ${i + 1}`, time: 0, running: false, start: null })));
    }
  }, []);

  // useEffect to handle updating the timer for running activities using requestAnimationFrame for accuracy
  useEffect(() => {
    if (!activities) return;
    let animationFrameId: number;

    const updateActivities = () => {
      setActivities((prevActivities) => {
        if (!prevActivities) return prevActivities;
        const updatedActivities = prevActivities.map((activity) => {
          if (activity.running && activity.start !== null) {
            // Calculate elapsed time since the timer started and add it to the current time
            const elapsed = (Date.now() - activity.start) / 1000 / 60;
            return { ...activity, time: activity.time + elapsed, start: Date.now() };
          }
          return activity;
        });
        // Store the updated activities in localStorage to persist data
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        return updatedActivities;
      });
      animationFrameId = requestAnimationFrame(updateActivities);
    };

    // Start the update loop
    animationFrameId = requestAnimationFrame(updateActivities);

    // Clear the animation frame when the component unmounts to avoid memory leaks
    return () => cancelAnimationFrame(animationFrameId);
  }, [activities]);

  // Handle start/stop button click for an activity
  const handleStartStop = (index: number) => {
    if (!activities) return;

    // Prevent multiple timers from running simultaneously
    const isAnyRunning = activities.some((activity) => activity.running);
    if (isAnyRunning && !activities[index].running) {
      alert('Only one timer can run at a time. Please stop the current timer first.');
      return;
    }

    setActivities((prevActivities) => {
      if (!prevActivities) return prevActivities;
      const updatedActivities = prevActivities.map((activity, i) => {
        if (i === index) {
          if (activity.running) {
            // Stop the timer and calculate elapsed time since it started
            const elapsed = (Date.now() - (activity.start ?? 0)) / 1000 / 60;
            return {
              ...activity,
              time: activity.time + elapsed, // Update the total time spent on the activity
              running: false, // Set running to false to stop the timer
              start: null, // Clear the start time
            };
          } else {
            // Start the timer by setting running to true and recording the start time
            return {
              ...activity,
              running: true,
              start: Date.now(),
            };
          }
        }
        return activity; // Return other activities unchanged
      });
      // Store the updated activities in localStorage to persist data
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      return updatedActivities;
    });
  };

  // Handle editing the name of an activity
  const handleEditName = (index: number, newName: string) => {
    if (!activities) return;
    setActivities((prevActivities) => {
      if (!prevActivities) return prevActivities;
      const updatedActivities = prevActivities.map((activity, i) =>
        i === index ? { ...activity, name: newName } : activity // Update the name for the specified activity
      );
      // Store the updated activities in localStorage to persist data
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      return updatedActivities;
    });
  };

  // Handle clearing the time spent on an activity
  const handleClearTime = (index: number) => {
    if (!activities) return;
    setActivities((prevActivities) => {
      if (!prevActivities) return prevActivities;
      const updatedActivities = prevActivities.map((activity, i) =>
        i === index ? { ...activity, time: 0, running: false, start: null } : activity // Reset the time, stop running, and clear start time
      );
      // Store the updated activities in localStorage to persist data
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      return updatedActivities;
    });
  };

  if (!activities) {
    return <div className="p-8 max-w-4xl mx-auto">Loading...</div>; // Render a loading state while activities are being loaded
  }

  const isAnyRunning = activities.some((activity) => activity.running);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Time Tracking App</h1>
      {activities.map((activity, index) => (
        <div
          key={index}
          className={`mb-4 p-4 border rounded-lg shadow-md flex items-center justify-between ${
            activity.running ? 'bg-green-100' : isAnyRunning ? 'bg-gray-200 opacity-50' : '' // Highlight the activity if it is running, gray out others if any timer is running
          }`}
        >
          <div>
            {/* Input to edit the activity name */}
            <input
              type="text"
              value={activity.name}
              onChange={(e) => handleEditName(index, e.target.value)}
              className="text-xl font-semibold mb-2 border-b-2 focus:outline-none bg-transparent"
              disabled={isAnyRunning && !activity.running} // Disable editing if another timer is running
            />
            {/* Display the elapsed time for the activity */}
            <p className="mb-2">Time: {activity.time.toFixed(2)} minutes</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Button to start/stop the timer for the activity */}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleStartStop(index)}
              disabled={activities.some((activity, i) => activity.running && i !== index)}
            >
              {activity.running ? 'Stop' : 'Start'}
            </button>
            <div className="flex items-center">
              <label className="mr-2">Edit Time:</label>
              {/* Disabled input to display the current time for the activity */}
              <input
                type="number"
                value={activity.time.toFixed(2)}
                disabled
                className="border rounded p-1 w-20 bg-gray-200 cursor-not-allowed"
              />
            </div>
            {/* Button to clear the time spent on the activity */}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleClearTime(index)}
              disabled={isAnyRunning && !activity.running} // Disable clearing if another timer is running
            >
              Clear Time
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
