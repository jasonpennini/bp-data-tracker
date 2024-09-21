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
        <Link to="/">
          <h1>Batting Practice Tracker</h1>
        </Link>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                 <Link to='/bpEntry'>BP Entry</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Custom Reports
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Max EV Leaderboards
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#">Coach Pitch</a></li>
                    <li><a className="dropdown-item" href="#">Blackbox</a></li>
                    <li><a className="dropdown-item" href="#">High Velocity</a></li>
                    <li><a className="dropdown-item" href="#">Situational</a></li>
                  </ul>
                </li>
              </ul>
              <form className="d-flex">
                <input className="form-control me-2" type="Player Search" placeholder="Player Search" aria-label="Player Search" />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
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
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar