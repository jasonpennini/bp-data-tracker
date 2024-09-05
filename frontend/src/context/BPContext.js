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
        bpEntries: [action.payload, ...state.bpEntres]
      }
     default:
      return state
  }
}


// the children prop draws from App on the index.js file which is what BattingPracticeContext wraps around
export const BPContextProvider = ({children}) => {

// useReducer differes fro
  const [state, dispatch] = useReducer(battingPracticeReducer, {
    bpEntres:null
  })


  return (
   // whole component tree will be wrapped around the root app component so all components have access to the BP Context State
   // spread operator separates properties in the state object
  <BattingPracticeContext.Provider value = {{...state, dispatch}}>
    { children }
  </BattingPracticeContext.Provider>
  )

}