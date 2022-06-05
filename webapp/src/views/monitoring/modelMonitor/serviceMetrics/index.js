import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CardLayout from '../components/cardLayout';
import { Grid } from '@material-ui/core';
import DateTimeRangePicker from '../components/dateTimeRangePicker';
import moment from 'moment';
import { fetchDataWithParamsV1 } from '../../../../global';
import BaseModel from '../../../baseModal';

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
    },
    chart: {
        cursor: 'pointer',
    },
    modal: {
        width: 'auto'
    },
    modalChart: {
        width: '900px',
        height: 'auto'
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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedChartIndex, setSelectedChartIndex] = useState(0);

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

    const handleChartClick = (index) => {
        setSelectedChartIndex(index);
        setModalOpen(true);
    }

    const renderChart = (data, title) => {
        return (
            <LineChart data={data} title={title}/>
        );
    }

    const renderModalChart = (data, title) => {
        return (
            <LineChart className={classes.modalChart} data={data} title={title}/>
        );
    }

    useEffect(() => {
        setMetric('Latency', 'average', setLatency);
        setMetric('Latency', 'count', setVolume);
        setMetric('Error', 'count', setErrorCount);
        setMetric('Cpu', 'average', setCpu);
        setMetric('MemoryUsed', 'average', setMemoryUsed);
        setMetric('BytesRecv', 'average', setBytesRecv);
    }, []);

    const chartSpec = [
        { title: 'Volume', data: volume },
        { title: 'Latency', data: latency },
        { title: 'Error', data: errorCount },
        { title: 'Availability', data: [] },
        { title: 'CPU', data: cpu },
        { title: 'GPU', data: [] },
        { title: 'Memory', data: memoryUsed },
        { title: 'Network', data: bytesRecv },
    ];

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
                    {chartSpec.map(({ title, data }, index) => (
                        <Grid item xs={6}>
                            <div className={classes.chart} onClick={() => handleChartClick(index)}>
                                {renderChart(data, title)}
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </CardLayout>
            <BaseModel className={classes.modal} open={modalOpen} onClose={() => setModalOpen(false)}>
                {renderModalChart(chartSpec[selectedChartIndex].data, chartSpec[selectedChartIndex].title)}
            </BaseModel>
        </div>
    )
}