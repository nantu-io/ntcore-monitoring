import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CardLayout from '../components/cardLayout';
import { Grid } from '@material-ui/core';
import DateTimeRangePicker from '../components/dateTimeRangePicker';



const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      marginBottom: '10px'
    },
    topBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    infoBar: {
        width: '50%',
        display: 'flex',
        alignItems: 'center'
    },
    datePicker: {
        width: '50%'
    }
}));

export default function ServiceMetricsTab()
{
    const classes = useStyles();

    return (
        <div>
            <CardLayout>
                <div className={classes.topBar}>
                    <div className={classes.infoBar}>
                        <InfoBar />
                    </div>
                    <div className={classes.datePicker}>
                        <DateTimeRangePicker onStartDateChange={() => {}} onEndDateChange={() => {}}/>
                    </div>
                </div>
            </CardLayout>
            <CardLayout>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Volume'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Latency'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Error'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Volume'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Latency'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Error'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Volume'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Prediction Latency'}/>
                    </Grid>
                </Grid>
            </CardLayout>
        </div>
    )
}