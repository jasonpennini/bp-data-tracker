import { useState, useEffect } from 'react'
import { useBPContext } from '../hooks/useBPEntriesContext'
import Calendar from 'react-calendar';
import { useAuthContext } from '../hooks/useAuthContext'

const BPForm = () => {
    const { dispatch, bpEntries } = useBPContext(); // Assuming you have access to previous BP entries from context

    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [newPlayer, setNewPlayer] = useState('');
    const [bpType, setBPType] = useState('');
    const [date, setDate] = useState('');
    const [exitSpeed, setexitSpeed] = useState('');
    const [contactPercentage, setContactPercentage] = useState('');
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([])
    const [existingPlayers, setExistingPlayers] = useState([]);

    // destructuring using from useAuthContext hook
    const {user} = useAuthContext();

    useEffect(() => {
        // Fetch existing players from previous BP entries
        if(bpEntries) {
            const players = [...new Set(bpEntries.map((entry) => entry.player))];
            setExistingPlayers(players);
        }
    }, [bpEntries]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!user) {
          setError('You must be logged in')
          return
        }
    
        const player = selectedPlayer || newPlayer;

        const bpEntry = { player, bpType, date, exitSpeed, contactPercentage };

        const response = await fetch('/bp-data', {
            method: 'POST',
            body: JSON.stringify(bpEntry),
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.token}`,
            },
        });
        console.log(response)
        const json = await response.json();
        console.log(json)
        if (!response.ok) {
            setError(json.error);
            setErrorFields(json.errorFields)
          }
        if (response.ok) {
            // Reset form fields
            setSelectedPlayer('');
            setNewPlayer('');
            setBPType('');
            setDate('');
            setexitSpeed('');
            setContactPercentage('');
            setError(null);
            dispatch({ type: 'CREATE_BPENTRY', payload: json });
            setErrorFields([]);
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New BP Entry</h3>
        
            <label>Select a Player or Add New Player</label>
            <select
                value={selectedPlayer}
                onChange={(e) => {
                  setSelectedPlayer(e.target.value);
                }}
            >
                <option value="">Select...</option>
                {existingPlayers.map((player, index) => (
                  <option key={index} value={player}>
                    {player}
                </option>
                ))}
            </select>
            <input
                type="text"
                value={newPlayer}
                onChange={(e) => {
                  setSelectedPlayer(''); // Clear selected player when typing a new one
                  setNewPlayer(e.target.value);
                }}
                className={errorFields.includes('Player') ? 'error' : ''}
                />
            <label> BP Type </label>
            <select
                id="bpType"
                onChange={(e)=> setBPType(e.target.value)}
                value={bpType}
                className={errorFields.includes('BP Type') ? 'error' : ''}
                >
            <option value=""> Select ... </option>
            <option value="Coach Pitch">Coach Pitch</option>
            <option value="Blackbox">Blackbox</option>
            <option value="High Velo">High Velocity</option>
            <option value="Situational">Situational</option>
            </select>
           
            <label> Date </label>
            <div   className="custom-calendar" onSubmit={handleSubmit}>
              <Calendar calendarType="gregory" onChange={(date) => setDate(date.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', weekStartsOn:0 }))} value={date} className="custom-calendar" />
            </div>
            <label> Max EV </label>
            <input
                min="0"
                type="number"
                onChange={(e)=> setexitSpeed(e.target.value)}
                value={exitSpeed}
                className = {errorFields.includes('Max EV') ? 'error' : ''}
                />
            <label> Contact Percentage </label>
            <input
                type="number"
                min="0"
                max="100"
                onChange={(e)=> setContactPercentage(e.target.value)}
                value={contactPercentage}
                className = {errorFields.includes('Contact Percentage') ? 'error' : ''}
                />
            <button> Add BP Entry</button>
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default BPForm