import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//pages and components
import Home from './pages/Home'
import Navbar from './components/navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BPEntryForm from './pages/BPEntry'
import Leaderboards from './components/Leaderboards.js'
import CSVUpload from './pages/CSVUpload.js'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <Home/> : <Navigate to="/login"/>} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route path="/leaderboards/:bpType" element={<Leaderboards />} />
            <Route path="/datainput/bpentry" element={<BPEntryForm />}/>
            <Route path="/datainput/csv" element={<CSVUpload />}/>

          </Routes>
        </div> 
      </BrowserRouter>
    </div>
  );
}

export default App;
