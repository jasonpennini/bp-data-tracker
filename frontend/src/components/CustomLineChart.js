import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function CustomLineChart({ filteredData, selectedBpType }) {

    const [exitSpeedChartData, setexitSpeedChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        if (filteredData) {
            const filteredByBpType = filteredData.filter(entry => entry.bpType === selectedBpType);
    
            if (filteredByBpType.length === 0) {
                // Handle the case where no data matches the selected BP type
                console.error(`No data found for bpType: ${selectedBpType}`);
                return;
            }
    
            const sortedData = filteredByBpType.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort data by date
            const labels = sortedData.map(entry => 
                new Date(entry.date).toLocaleDateString('en-US', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit'
                })
            );

            const exitSpeedData = filteredByBpType.map(entry => entry.exitSpeed);
            const player = sortedData[0].player;
            const bpType = sortedData[0].bpType;
    
            setexitSpeedChartData({
                labels: labels,
                datasets: [
                    {
                        label: `${player} | exitSpeed in MPH | ${bpType}`,
                        data: exitSpeedData,
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                    }
                ]
            });
        }
    }, [filteredData, selectedBpType]);


    // Define chart options
    const exitSpeedChartOptions = {
        plugins: {
            title: {
                display: true,
                size: 50,
                title:"Max EV"
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                }
            }
        }
    };

    const chartContainerStyle = {
        border: '1px solid black',
        padding: '10px',
        marginBottom: '20px',
        display: 'inline-block',
        width: 'calc(50% - 22px)', 
        boxSizing: 'border-box'
      };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={chartContainerStyle}>
                    <Line data={exitSpeedChartData} options ={exitSpeedChartOptions} />
                </div>
            </div>
        </div>
    );
}

export default CustomLineChart;