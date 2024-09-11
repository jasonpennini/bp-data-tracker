import {Link} from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const {logout} = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }
  
  return (
    <header>
      <div className="container">
        <Link to='/'>
          <h1>Batting Practice Tracker</h1>
        </Link>
        <nav> 
          {/* if user is truthy/ie user exists, then output the user email */}
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick}> Logout </button>
            </div>
          )}
          {/* if user is truthy/ie user exists, then output the user email */}
          {!user && (
            <div>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Signup</Link>
          </div>
          )}
          
        </nav>
      </div>
    </header>
  )
}

export default Navbar