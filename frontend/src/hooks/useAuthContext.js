import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuthContext = () => {
  // Auth context is an object. Which is whatever value we passed into the provider component,
  // including the state and dispatch object.
  const context = useContext(AuthContext);

  // check that we are within scope of the context, we can only use within the tree of components
  if (!context) {
    throw Error("useAuthContext must be used inside of a AuthContext Provider");
  }
  return context;
};
