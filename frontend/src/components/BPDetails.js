import { useBPContext } from "../hooks/useBPEntriesContext"
import { format } from 'date-fns'

const BPDetails = ({battingPractice}) => {

const { dispatch }  = useBPContext()

  const handleClick = async () => {
    const response = await fetch('/api/bp-data/' + battingPractice._id, {
      method: 'DELETE'
    })

    const json = await response.json()
    console.log(json, 'json object')

    if(response.ok) {
      console.log('about to dispatch')
      dispatch({type:'DELETE_BPENTRY', payload:json})
    }
  }

  const inputDateString = battingPractice.date
  const inputDate = new Date(inputDateString)       

  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(inputDate);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return format(date, 'MM/dd/yyyy hh:mm a');
    };

  return (
    <div className="batting-practice-details">
      <h4> {battingPractice.player}</h4>
      <p><strong>BP Type: {battingPractice.bpType}</strong></p>
      <p><strong>Date: {dateFormatted}</strong></p>
      <p><strong>Max EV: {battingPractice.maxEV}</strong></p>
      <p><strong>Contact %: {battingPractice.contactPercentage}</strong></p>
      <p>Created at: {formatDate(battingPractice.createdAt)}</p>
      <span onClick={handleClick}>Delete</span>
    </div>
  )
}

export default BPDetails