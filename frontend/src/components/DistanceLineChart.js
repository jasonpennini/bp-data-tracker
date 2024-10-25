import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function DistanceChart({ bpEntries }) {
  const [distanceChartData, setDistanceChartData] = useState({
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

      const labels = Object.keys(groupedEntriesByDateAndPlayer).sort();
      const playerColors = ['red', 'navy', 'black']; // Colors matching the exit speed chart
      const distanceDataSets = [];

      for (const date of labels) {
        const playerData = groupedEntriesByDateAndPlayer[date];

        for (const player in playerData) {
          const playerEntries = playerData[player];
          
          // Calculate max distance for the player on this date
          const maxDistance = Math.max(...playerEntries.map(entry => entry.distance));
          
          const datasetIndex = distanceDataSets.findIndex(dataset => dataset.label === player);

          if (datasetIndex === -1) {
            distanceDataSets.push({
              label: player,
              data: [maxDistance], // Add max distance for the first time
              backgroundColor: playerColors[distanceDataSets.length % playerColors.length],
              borderColor: playerColors[distanceDataSets.length % playerColors.length],
              borderWidth: 2
            });
          } else {
            distanceDataSets[datasetIndex].data.push(maxDistance); // Push max distance for this date
          }
        }
      }

      setDistanceChartData({
        labels: labels,
        datasets: distanceDataSets
      });
    }
  }, [bpEntries]);

  const distanceOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Max Distance in Feet',
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
    <div style={chartContainerStyle}>
      <Line data={distanceChartData} options={distanceOptions} height={400} />
    </div>
  );
}

export default DistanceChart;
