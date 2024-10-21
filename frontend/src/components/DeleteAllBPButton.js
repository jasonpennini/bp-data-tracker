import React from 'react';
import { useAuthContext } from '../hooks/useAuthContext'

const DeleteAllBPButton = () => {

  // destructuring using from useAuthContext hook
  const {user} = useAuthContext();

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all Batting Practice entries?");
    
    if (!confirmed) {
      return; 
    }

    try {
      const response = await fetch('/api/bp-data', {
        method: 'DELETE',
        headers: {
          'Authorization':`Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete all batting practices');
      }
      const result = await response.json();
      console.log('Deleted all BP entries:', result);
      alert('All batting practice entries have been deleted');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete entries. Please try again.');
    }
  };

  return (
    <button onClick={handleDeleteAll} className="delete-all-button">
      Delete All
    </button>
  );
};

export default DeleteAllBPButton;