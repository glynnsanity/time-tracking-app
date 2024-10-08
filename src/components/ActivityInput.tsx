import { useState, useEffect } from 'react';

interface Timer {
  id: number | null;
  isActive: boolean;
}

interface Activity {
  name: string;
  time: number;
  running: boolean;
  start?: number | null;
}

interface ActivityInputProps {
  timer: Timer | null;
  activity: Activity;
  index: number;
  handleUpdateActivity: (index: number, newTime: number) => void;
}

function ActivityInput({ timer, activity, index, handleUpdateActivity }: ActivityInputProps) {
  // Initialize with the activity's time value
  const [inputValue, setInputValue] = useState<string>(activity.time.toFixed(2));

  // Update the state once the activity time changes
  useEffect(() => {
    setInputValue(activity.time.toFixed(2));
  }, [activity.time]);

  // Handle input change but do not update the main state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle key press to update the main state only on "Enter"
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = parseFloat(inputValue);
      if (!isNaN(value)) {
        handleUpdateActivity(index, parseFloat(value.toFixed(2)));
      }
    }
  };

  return (
    <input
      type="number"
      step="0.01" // Allow input in increments of 0.01
      value={inputValue}
      onChange={handleInputChange} // Update the local input value only
      onKeyDown={handleKeyPress} // Update the main state only when "Enter" is pressed
      disabled={timer?.isActive}
      className="border rounded p-1 w-20"
    />
  );
}

export default ActivityInput;
