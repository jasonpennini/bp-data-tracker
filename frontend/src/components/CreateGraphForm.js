import { useState, useEffect } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the CSS for Calendar component
import { useAuthContext } from '../hooks/useAuthContext'


export const CreateGraphForm = ({bpEntries, onFilterData}) => {
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const [uniquePlayers, setUniquePlayers] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bpType, setBpType] = useState(''); // Add state for selected BP type
    const [filteredData, setFilteredData] = useState({});
    const [showChart, setShowChart] = useState(false);
    const [player, setPlayer] = useState('');

    const {user} = useAuthContext();
  

    const bpTypeOptions = ["Coach Thrown BP", "Breaking Ball Machine", "High Velo Machine", "Oppo Round"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that both start and end dates are selected
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }
        if(!player) {
            setError('Please select a player.');
            return;
        }
        if(!bpType) {
            setError('Please select a BP Type.');
            return;
        }

        console.log(`player before fetch url ${player}`)
        console.log(`startdate before fetch url ${startDate}`)
        console.log(`endDate before fetch url ${endDate}`)
        console.log(`bpType before fetch url ${bpType}`)

        // Construct the URL for the GET request
        const url = `/api/bp-data/?player=${player}&startDate=${startDate}&endDate=${endDate}&bpType=${bpType}`;

        console.log(`user token before fetch ${user.token}`)

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${user.token}`,

                }
            });
            console.log(`this is response.json immedietely after the fetch ${response.json}`)
            const json = await response.json();
            console.log(`json response to filtered get req ${JSON.stringify(json)}`)

            if (!response.ok) {
                setError(json.error);
                setErrorFields(json.errorFields);
            } else {
                console.log(`about to set filteredData to json ${JSON.stringify(json)}`)
                setFilteredData(json);
                setShowChart(true);
                console.log(bpType)
                onFilterData(json, bpType);
            }
        } catch (error) {
            console.error('Error fetching BP Entries:', error);
            setError('Failed to fetch BP Entries.');
        }
    }

    useEffect(() => {
        // Extract unique player names from bpEntries and update uniquePlayers state
        const players = [...new Set(bpEntries.map(entry => entry.player))];
        setUniquePlayers(players);
    }, [bpEntries]);

    return (
        <form className="createGraph" onSubmit={handleSubmit}>
            <h3>Create BP Chart</h3>
            <label>Select a Player and BP Type</label>
            <select
                onChange={(e) => setPlayer(e.target.value)}
                value={player}
                className={errorFields.includes('Player') ? 'error' : ''}
            >
                <option value="">Select Player...</option>
                {uniquePlayers.map((playerName, index) => (
                    <option key={index} value={playerName}>{playerName}</option>
                ))}
            </select>
            <select
                onChange={(e) => setBpType(e.target.value)} // Update selected BP type
                value={bpType}
                className={errorFields.includes('BPType') ? 'error' : ''}
            >
                <option value="">Select BP Type</option>
                {bpTypeOptions.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                ))}
            </select>

            <label>Start Date</label>
            <div className="startDate">
                <Calendar 
                    calendarType="gregory" 
                    onChange={(date) => setStartDate(date.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))} 
                    value={startDate} 
                    className="custom-calendar" 
                />
            </div>
            <label>End Date</label>
            <div className="endDate">
                <Calendar 
                    calendarType="gregory" 
                    onChange={(date) => setEndDate(date.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))} 
                    value={endDate} 
                    className="custom-calendar" 
                />
            </div>
            <button>Create BP Chart</button>

            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default CreateGraphForm;