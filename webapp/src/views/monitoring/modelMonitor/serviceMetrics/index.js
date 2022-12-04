import React, { useEffect, useState } from 'react';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CardLayout from '../components/cardLayout';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import { fetchDataWithParamsV1 } from '../../../../global';

export default function ServiceMetricsTab(props)
{
    const workspaceId = props.workspaceId;
    const [latency, setLatency] = useState([]);
    const [volume, setVolume] = useState([]);
    const [errorCount, setErrorCount] = useState([]);
    const [cpu, setCpu] = useState([]);
    const [memoryUsed, setMemoryUsed] = useState([]);
    const [bytesRecv, setBytesRecv] = useState([]);
    const [dateTimeRange, setDateTimeRange] = useState([]);

    const fetchMetrics = (workspaceId, name, startTime, endTime, statistics) => {
        return fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/metrics`, { name, startTime, endTime, statistics });
    }

    const setMetric = async (name, statistics, setMetricData) => {
        const startTime = dateTimeRange[0]?.valueOf() ?? moment().subtract(1, 'days').format('x');
        const endTime =  dateTimeRange[1]?.valueOf() ?? moment().format('x');
        const res = await fetchMetrics(workspaceId, name, startTime, endTime, statistics);
        const data = (res.data?.metrics ?? []).map(dp => ({
            value: dp.value,
            timestamp: moment(dp.timestamp).format('YYYY-MM-DD HH:mm:ss')
        }));
        setMetricData(data);
    }

    const setMetrics = () => {
        setMetric('Latency', 'average', setLatency);
        setMetric('Latency', 'count', setVolume);
        setMetric('Error', 'count', setErrorCount);
        setMetric('Cpu', 'average', setCpu);
        setMetric('MemoryUsed', 'average', setMemoryUsed);
        setMetric('BytesRecv', 'average', setBytesRecv);
    }

    useEffect(() => {
        setMetrics();
    }, [dateTimeRange]);

    return (
        <div>
            <div style={{padding: 0, marginBottom: 10}}>
                <InfoBar workspaceId={workspaceId} 
                    onDateTimeRangeChange={setDateTimeRange}
                    onRefresh={setMetrics}/>
            </div>
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