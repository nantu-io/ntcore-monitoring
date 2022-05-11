import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CardLayout from '../components/cardLayout';
import { Grid } from '@material-ui/core';
import DateTimeRangePicker from '../components/dateTimeRangePicker';
import moment from 'moment';
import { fetchDataWithParamsV1 } from '../../../../global';

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

export default function ServiceMetricsTab(props)
{
    const classes = useStyles();
    const workspaceId = props.workspaceId;
    const [latency, setLatency] = useState([]);
    const [volume, setVolume] = useState([]);
    const [errorCount, setErrorCount] = useState([]);
    const [cpu, setCpu] = useState([]);
    const [memoryUsed, setMemoryUsed] = useState([]);
    const [bytesRecv, setBytesRecv] = useState([]);

    const fetchMetrics = (workspaceId, name, startTime, endTime, statistics) => {
        return fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/metrics`, { name, startTime, endTime, statistics });
    }

    const setMetric = async (name, statistics, setMetricData) => {
        const startTime = moment().subtract(1, 'days').format('x');
        const endTime = moment().format('x');
        const res = await fetchMetrics(workspaceId, name, startTime, endTime, statistics);
        const data = (res.data?.metrics ?? []).map(dp => ({
            value: dp.value,
            timestamp: moment(dp.timestamp).format('YYYY-MM-DD HH:mm:ss')
        }));
        setMetricData(data);
    }

    useEffect(() => {
        setMetric('Latency', 'average', setLatency);
        setMetric('Latency', 'count', setVolume);
        setMetric('Error', 'count', setErrorCount);
        setMetric('Cpu', 'average', setCpu);
        setMetric('MemoryUsed', 'average', setMemoryUsed);
        setMetric('BytesRecv', 'average', setBytesRecv);
    }, []);

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
                        <LineChart data={volume} title={'Volume'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={latency} title={'Latency'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={errorCount} title={'Error'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'Availability'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={cpu} title={'CPU'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={[]} title={'GPU'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={memoryUsed} title={'Memory'}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LineChart data={bytesRecv} title={'Network'}/>
                    </Grid>
                </Grid>
            </CardLayout>
        </div>
    )
}