import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuthContext } from '../hooks/useAuthContext';

export const CreateGraphForm = ({ bpEntries, onFilterData }) => {
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const [uniquePlayers, setUniquePlayers] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bpType, setBpType] = useState('');
    const [filteredData, setFilteredData] = useState({});
    const [showChart, setShowChart] = useState(false);
    const [player, setPlayer] = useState('');

    const { user } = useAuthContext();
    const bpTypeOptions = ["Coach Pitch", "Blackbox", "High Velocity", "Situational"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }
        if (!player) {
            setError('Please select a player.');
            return;
        }
        if (!bpType) {
            setError('Please select a BP Type.');
            return;
        }

        const url = `/api/bp-data/?player=${player}&startDate=${startDate}&endDate=${endDate}&bpType=${bpType}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
                setErrorFields(json.errorFields);
            } else {
                setFilteredData(json);
                setShowChart(true);
                onFilterData(json, bpType);
                setError(null)
            }
        } catch (error) {
            setError('Failed to fetch BP Entries.');
        }
    }

    useEffect(() => {
        const players = [...new Set(bpEntries.map(entry => entry.player))];
        setUniquePlayers(players);
    }, [bpEntries]);

    return (
        <div className="container">
            <form className="createGraph" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <h3>Create BP Chart</h3>
                        <label className="selectPlayerBP">Select a Player and BP Type</label>
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
                            onChange={(e) => setBpType(e.target.value)}
                            value={bpType}
                            className={errorFields.includes('BPType') ? 'error' : ''}
                        >
                            <option value="">Select BP Type</option>
                            {bpTypeOptions.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label>Start Date</label>
                        <div className="startDate">
                            <Calendar
                                calendarType="gregory"
                                onChange={(date) => setStartDate(date.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))}
                                value={startDate}
                                className="custom-calendar"
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label>End Date</label>
                        <div className="endDate">
                            <Calendar
                                calendarType="gregory"
                                onChange={(date) => setEndDate(date.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))}
                                value={endDate}
                                className="custom-calendar"
                            />
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="text-center">
                    <button type="submit">Create BP Chart</button>
                </div>
                {error && <div className='error'>{error}</div>}
            </form>
        </div>
    );
}

export default CreateGraphForm;