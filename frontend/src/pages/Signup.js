import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // destructuring these from the useSignup hook
  const { signup, error, isLoading } = useSignup()
  const [isAdmin, setIsAdmin] = useState(null)


// takes in event object from the submission
const handleSubmit = async (e) => {
  // prevents default behavior of submitting a form which is to refresh the page
  e.preventDefault()

  // invoke signup when submit button is clicked and pass email and password to it
  // this will update current state with whatever email/password the user enters
  await signup(email, password, isAdmin)

}
  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>Email</label>
      <input type="email"
      // setting email to current value based on state of the event object
      onChange={(e) => setEmail(e.target.value)}
      value={email} />
      <label> Password </label>
      <input type="password"
      onChange={(e) => setPassword(e.target.value)}
      value={password} />
      
      <label> Set up with Admin Previliges? </label>
      <select
        id="bpType"
        onChange={(e) => setIsAdmin(e.target.value === "true")} // Convert to boolean
        value={isAdmin === null ? '' : isAdmin.toString()} 
        >
        <option value=""> Select ... </option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup