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

export default function LineChart({ data, title }) {
    const [display, setDisplay] = useState({ labels: [], datasets: [] });
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            // title: {
            //     display: !!title,
            //     text: title,
            // },
        },
    };

    useEffect(() => {
        const displayData = data.map(dp => dp.value);
        const labels = data.map(dp => dp.time);
        setDisplay({ labels, datasets: [{
            data: displayData,
            label: 'Prediction',
            // borderColor: 'rgb(255, 99, 132)',
            // backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }]});
    }, [data]);

    return (
        <Box sx={{  }}>
            <Typography>{title}</Typography>
            <Line options={options} data={display} />
        </Box>
    )
}
