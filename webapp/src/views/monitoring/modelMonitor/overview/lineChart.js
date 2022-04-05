import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardContent } from '@material-ui/core';
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
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function LineChart(props) {
    const { data } = props;
    const [display, setDisplay] = useState({ labels: [], datasets: [] });
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Live Predictions',
            },
        },
    };

    useEffect(() => {
        const displayData = data.map(dp => dp.value);
        const labels = data.map(dp => dp.time);
        setDisplay({ labels, datasets: [{
            data: displayData,
            label: 'Prediction',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }]});
    }, [data]);

    return (
        <Card>
            <CardContent>
                <Box sx={{  }}>
                    <Typography>Model Usage</Typography>
                    <Line options={options} data={display} />
                </Box>
            </CardContent>
        </Card>
    )
}
