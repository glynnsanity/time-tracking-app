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
  // Initialize with the activity's time value formatted to two decimal places
  const [inputValue, setInputValue] = useState<number>(parseFloat(activity.time.toFixed(2)));

  // Update the state once the activity time changes
  useEffect(() => {
    setInputValue(parseFloat(activity.time.toFixed(2)));
  }, [activity.time]);

  // Handle input change but do not update the main state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setInputValue(parseFloat(value.toFixed(2)));
    } else {
      setInputValue(0);
    }
  };

  // Handle key press to update the main state only on "Enter"
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateActivity(index, parseFloat(inputValue.toFixed(2)));
    }
  };

  return (
    <input
      type="number"
      step="0.01" // Allow input in increments of 0.01
      value={inputValue.toFixed(2)}
      onChange={handleInputChange} // Update the local input value only
      onKeyDown={handleKeyPress} // Update the main state only when "Enter" is pressed
      disabled={timer?.isActive}
      className="border rounded p-1 w-20"
    />
  );
}

export default ActivityInput;
