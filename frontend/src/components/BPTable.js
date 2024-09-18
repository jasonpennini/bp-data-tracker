import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useBPContext } from '../hooks/useBPEntriesContext';
import { useAuthContext } from '../hooks/useAuthContext'

const BPTable = ({bpEntries})  => {
  const { dispatch } = useBPContext();
  const {user} = useAuthContext();
  if(!user) {
    return 
  }

  // destructuring using from useAuthContext hook

    const handleDelete  = async (battingPractice) => {
      try {
        const response = await fetch('/api/bp-data/' + battingPractice, {
          method: 'DELETE',
          headers: {
            'Authorization':`Bearer ${user.token}`,
          }
        })
      
        const json = await response.json()
        console.log(json)
        if(response.ok) {
        // remove the deleted task from our task array and create a new array without it
        // then update state for tasks to no include the deleted task
        dispatch({ type:'DELETE_BPENTRY', payload:json});
      }
      else {
        console.log('Failed to delete BP Entry')
      }
    }
      catch (error) {
      console.log('Error deleting BP Entry', error)
      }
    }
    
  const columns = [
    { field: 'player', headerName: 'Player', width: 160, sortable:true, },
    { field: '_id', headerName: 'BP Event ID', width:220, },
    { field: 'bpType', headerName: 'BP Type', sortable: true, width: 175,},
    { field: 'date', headerName: 'Date', sortable: true, width: 130,},
    { field: 'maxEV', headerName: 'Max Exit Velo', width: 130, type:'number', sortable:true, },
    { field: 'contactPercentage', headerName: 'Contact %', width: 130, },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 175,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row._id)}
            style={{ marginRight: 8 }}
          >
            Delete
          </Button>
        </div>
      )
    },
  ];

  const rows = bpEntries.map((bpEntry, index) => {
    const inputDateString = bpEntry.date
    const inputDate = new Date(inputDateString)   

    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(inputDate);

    return {
      id: index+1,
      _id: bpEntry._id,
      player: bpEntry.player,
      bpType: bpEntry.bpType,
      date: dateFormatted,
      maxEV: bpEntry.maxEV,
      contactPercentage: bpEntry.contactPercentage,
    }
  });
  
return (
  <div style={{ height: 600, width: '100%' }}>
    <DataGrid rows={rows} columns={columns} initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 20 },
        },
      }}
    />
  </div>
);
}
    
export default BPTable