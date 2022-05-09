import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale,
} from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale,
    Title,
    Tooltip,
    Legend
);

export default function LineChart({ data, title }) {
    const [display, setDisplay] = useState({ datasets: [] });
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                type: 'time',
            }
        }
    };

    useEffect(() => {
        const displayData = data.map(dp => { return { x: dp.timestamp, y: dp.value }});
        setDisplay({ 
            datasets: [{
                data: displayData,
                label: 'Prediction',
                borderColor: 'rgb(87, 148, 247)',
                tension: 0.1,
            }],
        });
    }, [data]);

    return (
        <Box sx={{  }}>
            <Typography>{title}</Typography>
            <Line options={options} data={display} />
        </Box>
    )
}
