import React from 'react';
import Summary from '../components/summary';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CardLayout from '../components/cardLayout';
import { Grid } from '@material-ui/core';

export default function PerformanceTab(props)
{
    const { workspaceId } = props;
    return (
        <div>
            <InfoBar workspaceId={workspaceId} />
            <CardLayout>
                <Summary />
            </CardLayout>
            <CardLayout>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Accuracy'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Recall'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'F1 Score'}/>
                    </Grid>
                </Grid>
            </CardLayout>
        </div>
    )
}