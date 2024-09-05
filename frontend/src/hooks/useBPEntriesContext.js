import { BattingPracticeContext } from "../context/BPContext"; 
import { useContext } from "react";

export const useBPContext = () => {
  // Batting Practice context is an object. Which is whatever value we passed into the provider component,
  // including the state and dispatch object.
  const context = useContext(BattingPracticeContext)

  // check that we are within scope of the context, we can only use within the tree of components
  if(!context) {
    throw Error('useBPContext must be used inside of a BPContext Provider')
  }
  return context
}