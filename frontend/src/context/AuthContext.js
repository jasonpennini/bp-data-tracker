import { createContext, useReducer } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {user: action.payload}
    case 'LOGOUT':
      return {user:null}
    default:
      return state
  } 
}

// will wrap our entire application and provide state updates to children 
export const AuthContextProvider = ({children}) => {
  
  const [state, dispatch] = useReducer(authReducer, {
    user:null
  })

 console.log('AuthContext state:', state)

  return (
    // this needs to wrap entire application to provide current user state
    // we are passing current user state spread into an object and the dispatch function to be passed to other components. 
    <AuthContext.Provider value={{...state, dispatch}}>
      { children }
    </AuthContext.Provider>
  )

}
