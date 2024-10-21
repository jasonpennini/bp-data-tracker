import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import DeleteAllBPButton from './DeleteAllBPButton'; 


const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };


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
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="/bpUpload" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Data</a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link to="/data-input/csv" className="dropdown-item">CSV Upload</Link></li>
                    <li><Link to="/navbar/data-input/bpentry" className="dropdown-item">Manual BP Entry</Link></li>
                    <li><Link to="/data-input/edit" className="dropdown-item">Edit BP Entry</Link></li>
                    <li><DeleteAllBPButton /></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/custom-reports" className="nav-link">Custom Reports</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="/leaderboards" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Max EV Leaderboards</a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link to="/leaderboards/coachpitch" className="dropdown-item">Coach Pitch</Link></li>
                    <li><Link to="/leaderboards/blackbox" className="dropdown-item">Blackbox</Link></li>
                    <li><Link to="/leaderboards/highvelocity" className="dropdown-item">High Velocity</Link></li>
                    <li><Link to="/leaderboards/situational" className="dropdown-item">Situational</Link></li>
                  </ul>
                </li>
              </ul>
              <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Player Search" aria-label="Player Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
              {user && (
                <div className="userLogin">
                  <span>{user.email}</span>
                  <button onClick={handleClick} className="btn btn-outline-success">
                    Logout
                  </button>
                </div>
              )}
                {!user && (
                  <div>
                    <Link to='/login' className="btn btn-outline-success">Login</Link>
                    <Link to='/signup' className="btn btn-outline-success">Signup</Link>
                  </div>
                )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;