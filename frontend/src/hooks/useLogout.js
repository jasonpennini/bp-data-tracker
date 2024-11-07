import { useAuthContext } from "./useAuthContext";
import { useBPContext } from "./useBPEntriesContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: bpDispatch } = useBPContext();

  const logout = () => {
    // we need to update global state and remove JWT to log out
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    bpDispatch({ type: "SET_BPENTRIES", payload: null });
  };
  return { logout };
};
