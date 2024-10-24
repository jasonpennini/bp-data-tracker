import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { TextareaAutosize } from "@mui/material";

function DistanceLineChart({ bpEntries }) {
  const [distanceChartData, setdistanceChartData] = useState({
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
      const distanceDataSets = [];

      for (const date of labels) {
        const playerData = groupedEntriesByDateAndPlayer[date];

        for (const player in playerData) {
          const playerEntries = playerData[player];
          
          // Calculate max exit speed for the player on this date
          const maxDistance = Math.max(...playerEntries.map(entry => entry.distance));
          
          const datasetIndex = distanceDataSets.findIndex(dataset => dataset.label === player);

          if (datasetIndex === -1) {
            distanceDataSets.push({
              label: player,
              data: [maxDistance], 
              backgroundColor: playerColors[distanceDataSets.length % playerColors.length],
              borderColor: playerColors[distanceDataSets.length % playerColors.length],
              borderWidth: 2
            });
          } else {
            distanceDataSets[datasetIndex].data.push(maxDistance); // Push max exit speed for this date
          }
        }
      }
      setdistanceChartData({
        labels: labels,
        datasets: distanceDataSets
      });
    }
  }, [bpEntries]);

  const distanceSpeedOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Distance in Feet',
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
    maintainAspectRatio: true, // Allows the chart to stretch
    responsive: true, // Ensures the chart adjusts to the container size
    layout: {
      padding: {
        left: 0,
        right: 0, // Reduce padding on the right
        top: 20,
        bottom: 0
      }
    }
  };
  
  const chartContainerStyle = {
    border: '1px solid black',
    padding: '10px',
    marginBottom: '20px',
    display: 'inline-block',
    width: '50%', // Maximize width usage
    boxSizing: 'border-box'
  };

  return (
    <>
      <div style={chartContainerStyle}>
        <Line data={distanceChartData} options={distanceSpeedOptions} />
      </div> 
    </>
  );
}

export default DistanceLineChart;
