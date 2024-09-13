import { useState, useEffect} from 'react'
import { useBPContext } from '../hooks/useBPEntriesContext'
import { useAuthContext } from '../hooks/useAuthContext'

const BPEntryForm = () => {
  const { dispatch, bpEntries } = useBPContext()
  const [bpType, setBPtype] = useState("")
  const [date, setDate] = useState("")
  const [maxEV, setMaxEV] = useState("")
  const [contactPercentage, setContactPercentage] = useState("")
  const [error, setError] = useState("")
  const [errorFields, setErrorFields] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [newPlayer, setNewPlayer] = useState('')
  const [existingPlayers, setExistingPlayers] = useState([])

  // destructuring using from useAuthContext hook
  const {user} = useAuthContext();
  
  useEffect(() => {
    // Fetch existing players from previous BP entries
    if(bpEntries) {
        const players = [...new Set(bpEntries.map(entry => entry.player))];
        setExistingPlayers(players);
    }
  }, [bpEntries]);

  const handleSubmit = async (e) => {
    //prevents default action of form getting resubmitted
    e.preventDefault()

    if(!user) {
      setError('You must be logged in')
      return
    }

    const player = selectedPlayer || newPlayer

    //creating a dummy object to be sent as apart of our response 
    const bpEntry = { player, bpType, date, maxEV, contactPercentage }

    // fetching data from the front end with a post
    const response = await fetch('/api/bp-data', {
      method:'POST',
      body: JSON.stringify(bpEntry),
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${user.token}`
      }
    })
    // storing json response from back end, if the response is an error update the error state
    const json = await response.json()
    if(!response.ok) {
      setError(json.error)
      setErrorFields(json.errorFields)
    }
    // if the response is ok, clear any prior error state and set state variables to default state
    if(response.ok) {
      setError(null)
      console.log('new bp entry added', json)
      setSelectedPlayer('');
      setNewPlayer('');
      setMaxEV('')
      setContactPercentage('')
      setDate('')
      setBPtype('')
      // when dispatch function is invoked it updates the state of the BPEntries Object on BPContext. 
      // It is adding the payload to the array of objects, which is the newly created BPEntry
      // When this happens the Home Component is automatically re-rendered, due to the virtual DOM. It knows a change has been made
      // The map function will cycle through the BPEntries object and render the new BPEntry to the page, also causing re-fresh.  
      dispatch({type:'CREATE_BPENTRY', payload:json})
      setErrorFields([])
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3> Add a new BP Entry</h3>

    <label>Select Existing Player or Add New Player</label>
      <select
          value={selectedPlayer}
          onChange={(e) => {
              setSelectedPlayer(e.target.value);
              setNewPlayer(''); // Clear new player input when selecting an existing player
          }}
      >
          <option value="">Select...</option>
          {existingPlayers.map((player, index) => (
              <option key={index} value={player}>
                  {player}
          </option>
          ))}
      </select>
      <input
          type="text"
          value={newPlayer}
          onChange={(e) => {
              setSelectedPlayer(''); // Clear selected player when typing a new one
              setNewPlayer(e.target.value);
          }}
          className={errorFields.includes('Player') ? 'error' : ''}
      />

      <label> BP Type </label>
      <select
        id="bpType"
        onChange={(e)=> setBPtype(e.target.value)}
        value={bpType}
        className={errorFields.includes('BP Type') ? 'error' : ''}
        >
        <option value=""> Select ... </option>
        <option value="Coach Thrown BP">Coach Thrown BP</option>
        <option value="Breaking Ball Machine">Breaking Ball Machine</option>
        <option value="High Velo Machine">High Velo Machine</option>
        <option value="Oppo Round"> Oppo Round </option>
      </select>

     <label> Date: </label>
      <input 
        type="date"
        onChange={(e)=> setDate(e.target.value)}
        value={date}
        className = {errorFields.includes('Date') ? 'error' : ''}
       />

      <label> Max EV: </label>
      <input 
      type="number"
      onChange={(e)=> setMaxEV(e.target.value)}
      value={maxEV}
      className = {errorFields.includes('Max EV') ? 'error' : ''}
      placeholder="From 0-130 mph"
      />

      <label> Contact %: </label>
      <input 
      type="number"
      onChange={(e)=> setContactPercentage(e.target.value)}
      value={contactPercentage}
      className = {errorFields.includes('Contact Percentage') ? 'error' : ''}
      placeholder="From 0-100%"
      />

      <button> Add BP Entry </button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default BPEntryForm