import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart({ bpEntries }) {

// declaring state variables and setting initial state to an object with two key/value pairs for labels and datasets.
const [maxEVChartData, setMaxEVChartData] = useState({
  labels: [],
  datasets: []
});

// declaring state variables and setting initial state to an object with two key/value pairs for labels and datasets.
const [contactPercentageChartData, setContactPercentageChartData] = useState({
  labels: [],
  datasets: []
});


useEffect(() => {
  // when bpEntries prop changes, hook is run dynamically with React Virtual DOM, which updates BP Data on Line Charts
  // It will only be run if bpEntries state exists and has length. bpEntries is an array of objects containing bpData
  if (bpEntries) {
      const groupedEntriesByDateAndPlayer = bpEntries.reduce((acc, entry) => {
        // reduce method is iterating over each element in the bpEntries array and extracting date and player properties
          const date = new Date(entry.date).toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
          });
          const player = entry.player;
          // if the current date does not exists, it's then added to the accumulator object
          if (!acc[date]) {
              acc[date] = {};
          }
          // if the current player does not exist at a given date, then added him to accumulator object
          if (!acc[date][player]) {
              acc[date][player] = [];
          }
          // a player's maxEV and contact percentage for a given date is added to accumulator object
          acc[date][player].push({
              maxEV: entry.maxEV,
              contactPercentage: entry.contactPercentage
          });
          return acc;
          // empty object serves as initial value for the accumulator
      }, {});


      // taking the accumulator object that is returned when reduce finishes and converting it to an array then sorting it. 
      // sorting here gets the dates in the correct order within the acc object
      const labels = Object.keys(groupedEntriesByDateAndPlayer).sort();
  
      const playerColors=['red', 'navy','black'];

      // Chart for maxEV
      const maxEVDataSets = [];
      // maxEVDataSets is an array of objects. Each index represents a player and each player has a property called data.
      // The data property is an array of datapoints for their maxEV each day. 

      // [{label: 'Nick Yorke', data: Array(9), backgroundColor: 'red', borderColor: 'red', borderWidth: 2},
      //  {label: 'Blaze Jordan', data: Array(9), backgroundColor: 'navy', borderColor: 'navy', borderWidth: 2},
      //  {label: 'Gilberto Jimenez', data: Array(9), backgroundColor: 'black', borderColor: 'black', borderWidth: 2}]

      for (const date of labels) {
        // looping through the labels which are sorted dates withinin acc object
        // each iteration we declare a playerData variable and we access the value at whatever date
          const playerData = groupedEntriesByDateAndPlayer[date];
          for (const player in playerData) {
            // then we have a nested loop b/c each date could have data for more than one player
            // for each dataPoint within the player array for a given date, 
              const maxEVs = playerData[player].map(entry => entry.maxEV);

              // If the datasetIndex variable evaluates to -1 it means the queried player is not in the maxEVDataSets array
              const datasetIndex = maxEVDataSets.findIndex(dataset => dataset.label === player);
              // If the player does not exist in the maxEVDataSets array,
              // we create one and add properties for colors and border. 
              if (datasetIndex === -1) {
                  maxEVDataSets.push({
                      label: player,
                      data: maxEVs,
                      backgroundColor: playerColors[maxEVDataSets.length % playerColors.length],
                      borderColor: playerColors[maxEVDataSets.length % playerColors.length],
                      borderWidth: 2
                  });
              } else {
              // If the player exists, update the data property by adding the current date's maxEV field to the data array
                  maxEVDataSets[datasetIndex].data = maxEVDataSets[datasetIndex].data.concat(maxEVs);
              }
          }
      }
      

      // Updating state with labels and datapoints
      setMaxEVChartData({
          labels: labels,
          datasets: maxEVDataSets
      });

      // Chart for contactPercentage will follow the same logic as maxEV except using contactPercentage data
      const contactPercentageDataSets = [];
      for (const date of labels) {
          const playerData = groupedEntriesByDateAndPlayer[date];
          for (const player in playerData) {
              const contactPercentages = playerData[player].map(entry => entry.contactPercentage);
              const datasetIndex = contactPercentageDataSets.findIndex(dataset => dataset.label === player);
              if (datasetIndex === -1) {
                  contactPercentageDataSets.push({
                      label: player,
                      data: contactPercentages,
                      backgroundColor: playerColors[contactPercentageDataSets.length % playerColors.length],
                      borderColor: playerColors[contactPercentageDataSets.length % playerColors.length],
                      borderWidth: 2
                  });
              } else {
                  contactPercentageDataSets[datasetIndex].data = contactPercentageDataSets[datasetIndex].data.concat(contactPercentages);
              }
          }
      }
      setContactPercentageChartData({
          labels: labels,
          datasets: contactPercentageDataSets
      });
  }
  // The below dependency array tells react only run the useEffect hook when there are changes to bpEntries. 
  // When bpEntries changes run the useEffect hook which updates state for setContactPercentageChartData and 
  // setMaxEVChartData with the newest data point. 
}, [bpEntries]);

      // creating an object for options that will be applied to maxEV chart
      const maxEVOptions = {
        plugins: {
            title: {
                display: true,
                text: 'MaxEV in MPH',
                size: 50
            }
        },
        scales: {
            y: {
                title: {
                    display: false
                }
            }
        }
      };

      // creating an object for options that will be applied to contactPercentage chart
      const contactPercentageOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Contact %',
                size: 50
            }
        },
        scales: {
            y: {
                title: {
                    display: false
                }
            }
        }
      };

      const chartContainerStyle = {
        border: '1px solid black',
        padding: '10px',
        marginBottom: '20px',
        display: 'inline-block',
        width: 'calc(50% - 22px)', // Adjusted to consider 10px padding on each side and 1px border
        boxSizing: 'border-box'
      };

    return (
      // we add a fragment in our return statement b/c it allows us to render two separate line charts
      // React can only return a single JSX expression at a time. When you place both Line components in a fragment
      // they count as one expression. If there was no fragment, they would count as two expressions.    
      <>
        <div style={chartContainerStyle}>
          <Line data={maxEVChartData} options={maxEVOptions}/>
        </div>
        <div style={chartContainerStyle}>
          <Line data={contactPercentageChartData} options={contactPercentageOptions}/>
        </div>      
      </>
    );
}

export default LineChart;