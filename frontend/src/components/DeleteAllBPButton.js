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
      alert('All batting practice entries have been deleted');
     window.location.reload(); // This will perform a GET request for the current page

    } catch (error) {
      console.log(error, "error")
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