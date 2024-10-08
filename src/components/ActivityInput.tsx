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
  // Initialize with a default value of 0
  const [inputValue, setInputValue] = useState<number>(0);

  // Update the state once the activity object is available
  useEffect(() => {
    if (activity) {
      setInputValue(activity.time);
    }
  }, [activity]);

  // Handle input change but do not update the main state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseFloat(e.target.value));
  };

  // Handle key press to update the main state only on "Enter"
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateActivity(index, inputValue);
    }
  };

  return (
    <input
      type="number"
      value={inputValue.toFixed(2)}
      onChange={handleInputChange} // Update the local input value only
      onKeyDown={handleKeyPress} // Update the main state only when "Enter" is pressed
      disabled={timer?.isActive}
      className="border rounded p-1 w-20"
    />
  );
}

export default ActivityInput;
