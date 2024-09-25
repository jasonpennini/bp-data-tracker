import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [bpType, setBpType] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
  };

  const handleTypeSelect = (type) => {
    setBpType(type);
    navigate(`/leaderboards/${type}`);
    
    fetch(`/api/bp-practices?bpType=${type}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('BP Practices:', data);
      })
      .catch((error) => console.error('Error fetching BP Practices:', error));
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
                  <a className="nav-link dropdown-toggle" href="/bpUpload" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Data Input</a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link to="/datainput/bpEntry" className="dropdown-item">Manual Entry</Link></li>
                    <li><Link to="/datainput/csv" className="dropdown-item">CSV Upload</Link></li>
                    <li><Link to="/datainput/edit" className="dropdown-item">Edit BP Entry</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/custom-reports" className="nav-link">Custom Reports</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="/leaderboards" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Max EV Leaderboards</a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <button onClick={() => handleTypeSelect('coachpitch')} className="dropdown-item">
                        Coach Pitch
                      </button>
                    </li>
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