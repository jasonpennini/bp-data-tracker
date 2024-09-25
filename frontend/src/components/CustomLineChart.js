import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

function CustomLineChart({ filteredData, selectedBpType }) {

    const [exitSpeedChartData, setexitSpeedChartData] = useState({
        labels: [],
        datasets: []
    });

    const [contactPercentageChartData, setContactPercentageChartData] = useState({
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
            const contactPercentageData = filteredByBpType.map(entry => entry.contactPercentage);
            const player = sortedData[0].player;
            const bpType = sortedData[0].bpType;
    
            setexitSpeedChartData({
                labels: labels,
                datasets: [
                    {
                        label: `${player} exitSpeed ${bpType}`,
                        data: exitSpeedData,
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                    }
                ]
            });
    
            setContactPercentageChartData({
                labels: labels,
                datasets: [
                    {
                        label: `${player} Contact Percentage ${bpType}`,
                        data: contactPercentageData,
                        fill: false,
                        backgroundColor: 'rgb(54, 162, 235)',
                        borderColor: 'rgba(54, 162, 235, 0.5)',
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

    const contactPercentageVChartOptions = {
        plugins: {
            title: {
                display: true,
                size: 50
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Contact Percentage'
                },
                min: 0, // Set the minimum value of the Y-axis to 0
                max: 100 // Set the maximum value of the Y-axis to 100
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
        <div>
            <div style={{ display: 'flex' }}>
                <div style={chartContainerStyle}>
                    <Line data={exitSpeedChartData} options ={exitSpeedChartOptions} />
                </div>
                <div style={chartContainerStyle}>
                    <Line data={contactPercentageChartData} options ={contactPercentageVChartOptions} />
                </div>
            </div>
        </div>
    );
}

export default CustomLineChart;