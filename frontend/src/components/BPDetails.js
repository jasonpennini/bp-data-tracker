import { useBPContext } from "../hooks/useBPEntriesContext"

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

  return (
    <div className="batting-practice-details">
      <h4> {battingPractice.player}</h4>
      <p><strong>bp Type: {battingPractice.bpType}</strong></p>
      <p><strong>date:{battingPractice.date}</strong></p>
      <p><strong>maxEV: {battingPractice.maxEV}</strong></p>
      <p><strong>contactPercentage:{battingPractice.contactPercentage}</strong></p>
      <p>Created At:{battingPractice.createdAt}</p>
      <span onClick={handleClick}> Delete </span>
    </div>
  )
}

export default BPDetails