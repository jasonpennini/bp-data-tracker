import { useState, useEffect } from "react";
import { useBPContext } from "../hooks/useBPEntriesContext";
import Calendar from "react-calendar";
import { useAuthContext } from "../hooks/useAuthContext";

const BPEntryForm = () => {
  const { dispatch, bpEntries } = useBPContext(); // Assuming you have access to previous BP entries from context

  // form state variables
  const [angle, setAngle] = useState("");
  const [distance, setDistance] = useState("");
  const [autoPitchType, setAutoPitchType] = useState("");
  const [direction, setDirection] = useState("");
  const [bpType, setBPType] = useState("");
  const [date, setDate] = useState("");
  const [exitSpeed, setExitSpeed] = useState("");

  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [error, setError] = useState(null);
  const [errorFields, setErrorFields] = useState([]);
  const [existingPlayers, setExistingPlayers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [recentEntry, setRecentEntry] = useState(null);

  // destructuring using from useAuthContext hook
  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch existing players from previous BP entries
    if (bpEntries) {
      const players = [...new Set(bpEntries.map((entry) => entry.player))];
      setExistingPlayers(players);
    }
  }, [bpEntries]);

  const handleSubmit = async (e) => {
    console.log("handle submit");
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const player = selectedPlayer || newPlayer;

    const bpEntry = {
      player,
      bpType,
      date,
      exitSpeed,
      angle,
      direction,
      distance,
      autoPitchType,
    };
    console.log("before fetch and post request to bpEntry");
    console.log(bpEntry);
    const response = await fetch("/navbar/data-input/bpentry", {
      method: "POST",
      body: JSON.stringify(bpEntry),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setErrorFields(json.errorFields);
      setShowAlert(false);
    }
    if (response.ok) {
      // Reset form fields
      setSelectedPlayer("");
      setNewPlayer("");
      setBPType("");
      setDate("");
      setExitSpeed("");
      setDistance("");
      setDirection("");
      setAutoPitchType("");
      setAngle("");
      setError(null);
      dispatch({ type: "CREATE_BPENTRY", payload: json });
      setErrorFields([]);
      setShowAlert(true);
      setRecentEntry(json);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <div className="border-addBPEntry">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <div className="Player-entry">
                <label>Select or Add Player</label>
                <select
                  value={selectedPlayer || newPlayer} // Ensures correct display of chosen value
                  onChange={(e) => {
                    setSelectedPlayer(e.target.value);
                    setNewPlayer(""); // Clear newPlayer when selecting from dropdown
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
                    setSelectedPlayer(""); // Clear selectedPlayer when typing
                    setNewPlayer(e.target.value);
                  }}
                  className={errorFields.includes("Player") ? "error" : ""}
                />
              </div>
              <label> BP Type </label>
              <select
                id="bpType"
                onChange={(e) => {
                  console.log(bpType);
                  setBPType(e.target.value);
                }}
                value={bpType}
                className={errorFields.includes("BP Type") ? "error" : ""}
              >
                <option value=""> Select ... </option>
                <option value="Coach Pitch">Coach Pitch</option>
                <option value="Blackbox">Blackbox</option>
                <option value="High Velocity">High Velocity</option>
                <option value="Situational">Situational</option>
              </select>

              <label> Pitch Type </label>
              <select
                id="autoPitchType"
                onChange={(e) => setAutoPitchType(e.target.value)}
                value={autoPitchType}
                className={errorFields.includes("Pitch Type") ? "error" : ""}
              >
                <option value=""> Select ... </option>
                <option value="Sinker">Sinker</option>
                <option value="Changeup">Changeup</option>
                <option value="Slider">Slider</option>
                <option value="Four-Seam">Four-Seam</option>
                <option value="Curveball">Curveball</option>
                <option value="Cutter">Cutter</option>
                <option value="Splitter">Splitter</option>
              </select>
            </div>
            <div className="col-3">
              <label> Date </label>
              <div className="custom-calendar" onSubmit={handleSubmit}>
                <Calendar
                  calendarType="gregory"
                  onChange={(date) =>
                    setDate(
                      date.toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        weekStartsOn: 0,
                      }),
                    )
                  }
                  value={date}
                  className="custom-calendar"
                />
              </div>
            </div>
            <div className="col-2">
              <div className="number-entry">
                <label> Exit Speed </label>
                <input
                  min="0"
                  type="number"
                  onChange={(e) => setExitSpeed(e.target.value)}
                  value={exitSpeed}
                  className={errorFields.includes("Max EV") ? "error" : "input"}
                />
                <label> Angle: </label>
                <input
                  type="number"
                  onChange={(e) => setAngle(e.target.value)}
                  value={angle}
                  className={errorFields.includes("Angle") ? "error" : "input"}
                />
                <label> Direction: </label>
                <input
                  type="number"
                  onChange={(e) => setDirection(e.target.value)}
                  value={direction}
                  className={
                    errorFields.includes("Direction") ? "error" : "input"
                  }
                />
                <label> Distance: </label>
                <input
                  type="number"
                  onChange={(e) => setDistance(e.target.value)}
                  value={distance}
                  className={
                    errorFields.includes("Distance") ? "error" : "input"
                  }
                />
              </div>
            </div>
          </div>
          <br></br>
          <div className="row">
            <button className="bpEntryButton"> Add BP Entry</button>
          </div>
          {error && <div className="error">{error}</div>}
          {showAlert && (
            <div className="alert alert-success">Entry Posted succesfully</div>
          )}
          {recentEntry && (
            <div className="recent-entry">
              <h4>Recently Added Entry:</h4>
              <p>
                <strong>Player:</strong> {recentEntry.player}
              </p>
              <p>
                <strong>BP Type:</strong> {recentEntry.bpType}
              </p>
              <p>
                <strong>Date:</strong> {recentEntry.date}
              </p>
              <p>
                <strong>Exit Speed:</strong> {recentEntry.exitSpeed}
              </p>
              <p>
                <strong>Angle:</strong> {recentEntry.angle}
              </p>
              <p>
                <strong>Direction:</strong> {recentEntry.direction}
              </p>
              <p>
                <strong>Distance:</strong> {recentEntry.distance}
              </p>
              <p>
                <strong>Pitch Type:</strong> {recentEntry.autoPitchType}
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default BPEntryForm;
