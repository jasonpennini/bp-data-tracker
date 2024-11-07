import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function CustomDistanceLineChart({ filteredData, selectedBpType }) {
  const [distanceChartData, setDistanceChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (filteredData) {
      const filteredByBpType = filteredData.filter(
        (entry) => entry.bpType === selectedBpType,
      );

      if (filteredByBpType.length === 0) {
        console.error(`No data found for bpType: ${selectedBpType}`);
        return;
      }

      const sortedData = filteredByBpType.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      ); // Sort data by date
      const labels = sortedData.map((entry) =>
        new Date(entry.date).toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        }),
      );

      const distanceData = filteredByBpType.map((entry) => entry.distance);
      const player = sortedData[0].player;
      const bpType = sortedData[0].bpType;

      setDistanceChartData({
        labels: labels,
        datasets: [
          {
            label: `${player} | Max Distance in feet | ${bpType}`,
            data: distanceData,
            fill: false,
            backgroundColor: "rgb(54, 162, 235)", // Blue color
            borderColor: "rgba(54, 162, 235, 0.5)", // Lighter blue border
          },
        ],
      });
    }
  }, [filteredData, selectedBpType]);

  // Define chart options
  const distanceChartOptions = {
    plugins: {
      title: {
        display: true,
        size: 50,
        title: "Max EV",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
        },
      },
    },
  };

  const chartContainerStyle = {
    border: "1px solid black",
    padding: "10px",
    marginBottom: "20px",
    display: "inline-block",
    width: "calc(50% - 22px)",
    boxSizing: "border-box",
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={chartContainerStyle}>
          <Line data={distanceChartData} options={distanceChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default CustomDistanceLineChart;
