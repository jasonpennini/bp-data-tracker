import { useEffect, useState } from 'react'
// hook provides us with dispatch function and state object
import { useBPContext } from '../hooks/useBPEntriesContext'
import { useAuthContext } from '../hooks/useAuthContext'

//components
// import BPDetails from "../components/BPDetails"
// import BPEntryForm from "../components/BPEntryForm"
import BPTable from '../components/BPTable'
import LineChart from '../components/LineChart';
import CustomLineChart from '../components/CustomLineChart';
// import BPForm from '../components/BPForm';
import CreateGraphForm from '../components/CreateGraphForm';

const Home = () => {
  // desctructuring off of the useBPContext hook. bpEntries an array of BP Entry objects. 
  // dispatch will be the function that executes the switch/case statements to update the bpEntries object on BPContext.js
  const { bpEntries, dispatch } = useBPContext()
  const { user } = useAuthContext()
  const [showChart, setShowChart] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBpType, setSelectedBpType] = useState(''); // Hold selected BP type

  //dependency array tells useEffect hook to run when either the dispatch function or user changes, in addition to the initial rendering of home 
   useEffect(() => {
    const fetchBPWorkouts = async () => {
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

  const handleFilterData = (data, bpType) => {
    setFilteredData(data);  // Set filtered data
    setSelectedBpType(bpType);  // Set selected BP type
    setShowChart(true); // Show the chart when filtered data is available
  };

return (
  <div className="home">
    <div className='battingPractices'>
      <div className="BPTable">
        {bpEntries && <BPTable key={bpEntries._id} bpEntries={bpEntries}/>}
      </div>            
      <br></br>
      <div>
        <LineChart bpEntries={bpEntries}/>
        {showChart && <CustomLineChart filteredData={filteredData} selectedBpType={selectedBpType}/>}
      </div>
      </div>
    <div>
      {bpEntries && <CreateGraphForm key={bpEntries._id} bpEntries={bpEntries} onFilterData={handleFilterData}/>}
    </div>
   </div>
  );
  }
export default Home