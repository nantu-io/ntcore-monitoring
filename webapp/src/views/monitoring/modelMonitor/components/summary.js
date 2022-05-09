import React from 'react';
import { Typography, Box } from '@material-ui/core';

const PrimaryDataDisplay = (props) => {
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderColor: 'background.gray',
                borderRadius: 1,
                p: 2,
                minWidth: 200,
                maxWidth: 400,
                display: 'inline-block'
            }}
        >
            <Box sx={{ color: 'text.secondary' }}>Live Predictions</Box>
            <Box sx={{ color: 'success.main', fontSize: 34, fontWeight: 'medium' }}>
                25678
            </Box>
            <Box
                sx={{ color: 'success.dark', fontSize: 16, verticalAlign: 'sub' }}
            />
            <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 12 }}>
                Since
            </Box>
            <Box
                sx={{
                    color: 'success.dark',
                    display: 'inline',
                    fontWeight: 'medium',
                    mx: 0.5,
                }}
            >
                03/23/2022
            </Box>
        </Box>
    )
}

const SecondaryDataDisplay = (props) => {
    const { title, value } = props;
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderColor: 'background.gray',
                borderRadius: 1,
                p: 2,
                minWidth: 200,
                display: 'inline-block'
            }}
        >
            <Box sx={{ color: 'text.secondary' }}>{title}</Box>
            <Box sx={{ color: 'text.main', fontSize: 28, fontWeight: 'medium' }}>
                {value}
            </Box>
        </Box>
    )
}

export default function Summary(props) {
    return (
        <div>
            <Typography sx={{ fontSize: 28 }}>Summary</Typography>
            <PrimaryDataDisplay />
            <SecondaryDataDisplay title="Accuracy" value={0.761} />
            <SecondaryDataDisplay title="Precision" value={0.779} />
            <SecondaryDataDisplay title="Recall" value={0.253} />
            <SecondaryDataDisplay title="F1 Score" value={0.382} />
        </div>
    )
}
