import { useEffect } from 'react'

//components
import BPDetails from "../components/BPDetails"
import BPEntryForm from "../components/BPEntryForm"

// hook provides us with dispatch function and state object
import { useBPContext } from '../hooks/useBPEntriesContext'

// empty dependency array tells useEffect hook to only fire once
const Home = () => {

  // desctructuring off of the useBPContext hook. bpEntries an array of BP Entry objects. 
  // dispatch will be the function that executes the switch/case statements to update the bpEntries object on BPContext.js
  const { bpEntries, dispatch } = useBPContext()
  
  // useEffect hook fires only when component is first rendered
  useEffect(() => {
    const fetchBPWorkouts = async () => {
      // get request for all bp data will be executed when this function is invoked. 
      const response = await fetch('/api/bp-data/')
      // creating an array of json objects with all batting practices
      const json = await response.json()
      // If the json array of objects is returned succesfully, then update state with it. 
      // I.e. BP Workouts will be set to the json array of objects.
      if (response.ok) {
        dispatch({type:'SET_BPENTRIES', payload: json})
      }
    }
    fetchBPWorkouts()
  }, [dispatch])

    return (
      <div className="home">
        <div className="bpWorkout">
          {/* if BPWorkouts exists map through them and do something*/}
          {bpEntries && bpEntries.map((battingPractice) => (
            <BPDetails battingPractice={battingPractice} key={battingPractice._id} />
          ))}
        </div>
        <div className="bpEntryForm">
          <BPEntryForm />
        </div>
      </div>
    )
  }
export default Home