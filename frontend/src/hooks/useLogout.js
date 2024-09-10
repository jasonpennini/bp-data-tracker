import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    // we need to update global state and remove JWT to log out
    localStorage.removeItem('user')
    dispatch({type:'LOGOUT'})
  }
  return {logout}
}

