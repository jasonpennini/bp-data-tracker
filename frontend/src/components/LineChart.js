import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { touchRippleClasses } from "@mui/material";

function LineChart({ bpEntries }) {
  const [exitSpeedChartData, setExitSpeedChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (bpEntries) {
      const groupedEntriesByDateAndPlayer = bpEntries.reduce((acc, entry) => {
        const date = new Date(entry.date).toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit'
        });
        const player = entry.player;
        
        if (!acc[date]) {
          acc[date] = {};
        }
        
        if (!acc[date][player]) {
          acc[date][player] = [];
        }
        
        acc[date][player].push({
          exitSpeed: entry.exitSpeed,
          distance: entry.distance
        });
        
        return acc;
      }, {});

      // accumulator function builds a nested object which creates dates then then players with exit speeds and distance for each date
      // {
      //   "9/28/24": {
      //     "Fudge McCarthy": [
      //       { exitSpeed: 90, distance: 250 },
      //       { exitSpeed: 88, distance: 245 },
      //       { exitSpeed: 85, distance: 240 },
      //       { exitSpeed: 91, distance: 255 },
      //       { exitSpeed: 87, distance: 242 },
      //       { exitSpeed: 92, distance: 260 },
      //       { exitSpeed: 89, distance: 248 },
      //       { exitSpeed: 90, distance: 252 },
      //       { exitSpeed: 93, distance: 265 },
      //       { exitSpeed: 86, distance: 238 }
      //     ],
      //     "Marcus Blache": [
      //       { exitSpeed: 85, distance: 230 },
      //       { exitSpeed: 87, distance: 235 },
      //       { exitSpeed: 84, distance: 225 },
      //       { exitSpeed: 86, distance: 240 },
      //       { exitSpeed: 83, distance: 220 },
      //       { exitSpeed: 89, distance: 245 },
      //       { exitSpeed: 85, distance: 230 },
      //       { exitSpeed: 88, distance: 250 },
      //       { exitSpeed: 86, distance: 240 },
      //       { exitSpeed: 90, distance: 255 }
      //     ],
      //     "Davey Crocket": [
      //       { exitSpeed: 95, distance: 270 },
      //       { exitSpeed: 92, distance: 265 },
      //       { exitSpeed: 94, distance: 268 },
      //       { exitSpeed: 93, distance: 260 },
      //       { exitSpeed: 91, distance: 255 },
      //       { exitSpeed: 96, distance: 275 },
      //       { exitSpeed: 90, distance: 250 },
      //       { exitSpeed: 94, distance: 268 },
      //       { exitSpeed: 92, distance: 265 },
      //       { exitSpeed: 97, distance: 278 }
      //     ]
      //   }
      // }

      const labels = Object.keys(groupedEntriesByDateAndPlayer).sort();
      const playerColors = ['red', 'navy', 'black']; // Color options for different players
      const exitSpeedDataSets = [];

      for (const date of labels) {
        const playerData = groupedEntriesByDateAndPlayer[date];

        for (const player in playerData) {
          const playerEntries = playerData[player];
          
          // Calculate max exit speed for the player on this date
          const maxExitSpeed = Math.max(...playerEntries.map(entry => entry.exitSpeed));
          
          const datasetIndex = exitSpeedDataSets.findIndex(dataset => dataset.label === player);

          if (datasetIndex === -1) {
            exitSpeedDataSets.push({
              label: player,
              data: [maxExitSpeed], // Add max exit speed for the first time
              backgroundColor: playerColors[exitSpeedDataSets.length % playerColors.length],
              borderColor: playerColors[exitSpeedDataSets.length % playerColors.length],
              borderWidth: 2
            });
          } else {
            exitSpeedDataSets[datasetIndex].data.push(maxExitSpeed); // Push max exit speed for this date
          }
        }
      }

      setExitSpeedChartData({
        labels: labels,
        datasets: exitSpeedDataSets
      });
    }
  }, [bpEntries]);

  const exitSpeedOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Max Exit Speed in MPH',
        size: 50
      }
    },
    scales: {
      y: {
        title: {
          display: false
        }
      }
    },
    maintainAspectRatio: false, // Disable maintaining aspect ratio
    responsive: true, // Keep the chart responsive
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    }
  };
  
  const chartContainerStyle = {
    border: '1px solid black',
    padding: '10px',
    marginBottom: '20px',
    width: '45%', // Take up full width of the parent container
    height: '400px', // Set the height of the container
    boxSizing: 'border-box'
  };
  
  return (
    <>
      <div style={chartContainerStyle}>
        <Line data={exitSpeedChartData} options={exitSpeedOptions} height={400} />
      </div>
    </>
  );
} 

export default LineChart;
