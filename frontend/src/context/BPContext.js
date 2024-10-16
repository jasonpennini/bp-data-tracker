import { createContext, useReducer } from 'react'

// creating BattingPractice context state
export const BattingPracticeContext = createContext()

export const battingPracticeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BPENTRIES':
      return {
        bpEntries: action.payload
      }
    case 'CREATE_BPENTRY':
      return {
        bpEntries: [action.payload, ...state.bpEntries]
      }
    case 'DELETE_BPENTRY':
      return {
        bpEntries: state.bpEntries.filter(w => w._id !== action.payload._id)
      }
     default:
      return state
  }
}

// the children prop draws from App on the index.js file which is what BattingPracticeContext wraps around
export const BPContextProvider = ({children}) => {

  const [state, dispatch] = useReducer(battingPracticeReducer, {
    bpEntries:[]
  })

  return (
   // whole component tree will be wrapped around the root app component so all components have access to the BP Context State
   // spread operator separates properties in the state object
  <BattingPracticeContext.Provider value = {{...state, dispatch}}>
    { children }
  </BattingPracticeContext.Provider>
  )
}