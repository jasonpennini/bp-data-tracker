import { useEffect, useState } from 'react'
// hook provides us with dispatch function and state object
import { useBPContext } from '../hooks/useBPEntriesContext'
import { useAuthContext } from '../hooks/useAuthContext'

//components
import BPTable from '../components/BPTable'

const MaxEVHighVelo = () => {

  // desctructuring off of the useBPContext hook. bpEntries an array of BP Entry objects. 
  // dispatch will be the function that executes the switch/case statements to update the bpEntries object on BPContext.js
  const { bpEntries, dispatch } = useBPContext()
  const { user } = useAuthContext()


//dependency array tells useEffect hook to run when either the dispatch function or user changes, in addition to the initial rendering of home 
useEffect(() => {
  const fetchBPWorkouts = async () => {
    console.log(bpEntries)
    
    // get request for all bp data will be executed when this function is invoked. 
    // Only perform fetch if user is authorized with bearer token from JWT
    const response = await fetch('/api/bp-data/', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
    })
    // creating an array of json objects with all batting practices
    const json = await response.json()
    // If the json array of objects is returned succesfully, then update state with it. 
    // I.e. BP Workouts will be set to the json array of objects.
    if (response.ok) {
      dispatch({type:'SET_BPENTRIES', payload: json})
    }
  }
  if(user) {
    fetchBPWorkouts()
  }
}, [dispatch, user])

  return (
  <div className="home">
    <div className='battingPractices'>
      <div className="BPTable">
        {bpEntries && <BPTable key={bpEntries._id} bpEntries={bpEntries}/>}
      </div>            
      <br></br>
    </div>
  </div>  
  )
}
export default MaxEVHighVelo