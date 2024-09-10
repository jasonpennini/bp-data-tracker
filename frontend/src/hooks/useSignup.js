import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  // declaring state variables to track errors and isLoading
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const {dispatch} = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    // if an error previously existed, set to null to start off
    setError(null)

    // localhost:4000/ is added automatically with the proxy
    // will trigger a post request with the criteria specified in the 2nd arg
    const response = await fetch('api/user/signup', {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email, password})
    })
    const json = await response.json()

    if(!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if(response.ok) {
      // save the user to local storage with JWT and email property, so if they want to log back in a couple hours later
      // we can still detect the user is logged in with the presence of the JWT
      localStorage.setItem('user', JSON.stringify(json))
      // update auth context
      // invoking dispatch function and triggering switch case with type 'LOGIN'
      dispatch({type:'LOGIN', payload: json})
      setIsLoading(false)
    }
  }
  return {signup, isLoading, error}
}

export default useSignup