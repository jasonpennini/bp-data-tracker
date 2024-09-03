const bpDetails = ({battingPractice}) => {
  return (
    <div className="batting-practice-details">
      <h4> {battingPractice.player}</h4>
      <p><strong>bp Type: {battingPractice.bpType}</strong></p>
      <p><strong>date:{battingPractice.date}</strong></p>
      <p><strong>maxEV: {battingPractice.maxEV}</strong></p>
      <p><strong>contactPercentage:{battingPractice.contactPercentage}</strong></p>
      <p>Created At:{battingPractice.createdAt}</p>
    </div>
  )
}

export default bpDetails