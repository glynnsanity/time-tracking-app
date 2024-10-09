import React from 'react';

interface AddActivityButtonProps {
  onAddActivity: () => void;
}

const AddActivityButton: React.FC<AddActivityButtonProps> = ({ onAddActivity }) => {
  return (
    <button
      onClick={onAddActivity}
      className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      aria-label="Add new activity"
    >
      Add Activity
    </button>
  );
};

export default AddActivityButton;