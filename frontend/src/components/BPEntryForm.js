import { useState } from 'react'
import { useBPContext } from '../hooks/useBPEntriesContext'

const BPEntryForm = () => {
  const [player, setPlayer] = useState("")
  const [bpType, setBPtype] = useState("")
  const [date, setDate] = useState("")
  const [maxEV, setMaxEV] = useState("")
  const [contactPercentage, setContactPercentage] = useState("")
  const [error, setError] = useState("")
  const { dispatch } = useBPContext()
  const [errorFields, setErrorFields] = useState([])

  const handleSubmit = async (e) => {
    //prevents default action of form getting resubmitted
    e.preventDefault()

    //creating a dummy object to be sent as apart of our response 
    const bpEntry = {player, bpType, date, maxEV, contactPercentage}

    // fetching data from the front end with a post
    const response = await fetch('/api/bp-data', {
      method:'POST',
      body: JSON.stringify(bpEntry),
      headers:{
        'Content-Type':'application/json'
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
      setPlayer('')
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

      <label> Player: </label>
      <input 
        type="text"
        onChange={(e)=> setPlayer(e.target.value)}
        value={player}
        className = {errorFields.includes('Player') ? 'error' : ''}
        placeholder="Enter Player Name"
       />

      <label> BP Type: </label>
      <input 
        type="text"
        onChange={(e)=> setBPtype(e.target.value)}
        value={bpType}
        className = {errorFields.includes('BP Type') ? 'error' : ''}
        placeholder="Enter Valid BP Type"
       />

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