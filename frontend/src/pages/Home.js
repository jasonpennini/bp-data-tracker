import {useEffect, useState} from 'react'

//components
import BPDetails from "../components/BPDetails"
import BPEntryForm from "../components/BPEntryForm"

// empty dependency array tells useEffect hook to only fire once
const Home = () => {

  // setting state variable and setter function
  // default state is null
  const [BPWorkouts, setBPWorkouts] = useState(null)

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
        setBPWorkouts(json)
      }
    }
    fetchBPWorkouts()
  }, [])

    return (
      <div className="home">
        <div className="bpWorkout">
          {/* if BPWorkouts exists map through them and do something*/}
          {BPWorkouts && BPWorkouts.map((battingPractice) => (
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