import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//pages and components
import Home from './pages/Home'
import Navbar from './components/navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BPEntryForm from './pages/BPEntryForm.js'
import Leaderboards from './components/Leaderboards.js'
import CSVUpload from './pages/CSVUpload.js'
import CustomChart from './pages/Custom-Report.js'
import MaxEVBlackbox from './pages/MaxEVBlackbox.js'
import MaxEVCoachPitch from './pages/MaxEVCoachPitch.js'
import MaxEVHighVelo from './pages/MaxEVHighVelo.js'
import MaxEVSituational from './pages/MaxEVSituational.js'


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
            <Route path="/navbar/data-input/bpentry" element={<BPEntryForm />}/>
            <Route path="/data-input/csv" element={<CSVUpload />}/>
            <Route path="/custom-reports" element={<CustomChart />}/>
            <Route path="/leaderboards/blackbox" element={<MaxEVBlackbox />}/>
            <Route path="/leaderboards/situational" element={<MaxEVSituational />}/>
            <Route path="/leaderboards/highvelocity" element={<MaxEVHighVelo />}/>
            <Route path="/leaderboards/coachpitch" element={<MaxEVCoachPitch />}/>
          </Routes>
        </div> 
      </BrowserRouter>
    </div>
  );
}

export default App;
