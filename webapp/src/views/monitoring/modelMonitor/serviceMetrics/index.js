import React, { useEffect, useState } from 'react';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CardLayout from '../components/cardLayout';
import { Typography, Grid } from '@material-ui/core';
import moment from 'moment';
import { fetchDataWithParamsV1 } from '../../../../global';
import { DateRangePicker, ButtonToolbar, ButtonGroup, Button, IconButton } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';
import { FaExpandArrowsAlt as ExpandIcon } from 'react-icons/fa';
import BaseModel from '../../../baseModal';
import { makeStyles } from '@material-ui/core/styles';

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
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: '10px'
    },
    modal: {
        width: 'auto'
    },
    modalRoot: {
        padding: '20px'
    },
    modalChart: {
        width: 'min(1200px, 90vw)',
        height: 'auto'
    },
    expandIcon: {
        marginTop: 1, 
        marginLeft: 3, 
        padding: 5, 
        border: '1px solid #E8E8E8', 
        background: 'white',
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
            <InfoBar workspaceId={workspaceId} 
                    onDateTimeRangeChange={setDateTimeRange}
                    onRefresh={setMetrics}/>
            <CardLayout>
                <Grid container spacing={3}>
                    {chartSpec.map(({ title, data }, index) => (
                        <Grid item xs={6}>
                                <div className={classes.chartHeader}>
                                    <Typography>{title}</Typography>
                                    <IconButton
                                        icon={<ExpandIcon color="gray" />} 
                                        style={{marginTop: 1, marginLeft: 3, padding: 5}}
                                        onClick={() => handleChartClick(index)}
                                    />
                                </div>
                                {renderChart(data, title)}
                        </Grid>
                    ))}
                </Grid>
            </CardLayout>
            <BaseModel className={classes.modal} open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className={classes.modalRoot}>
                    <ToolBar onDateTimeRangeChange={setDateTimeRange} onRefresh={setMetrics} />
                    {renderModalChart(chartSpec[selectedChartIndex].data, chartSpec[selectedChartIndex].title)}
                </div>
            </BaseModel>
        </div>
    );
}

function ToolBar({ onDateTimeRangeChange, onRefresh }) {
    return (
        <Grid container spacing={0} style={{padding: 0, marginBottom: 10}}>
            <Grid item xs={10}>
                <DateRangePicker
                    format="MM/dd/yyyy HH:mm"
                    cleanable
                    defaultValue={[moment().subtract(1, 'months').toDate(), moment().toDate()]}
                    onChange={(range) => { 
                        onDateTimeRangeChange(range);
                    }}
                    onClean={() => {
                        onDateTimeRangeChange([]);
                    }}/>
                <ButtonToolbar style={{display: 'inline'}}>
                    <ButtonGroup size="sm">
                    <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}} 
                            onClick={() => onDateTimeRangeChange([moment().subtract(1, 'hours').toDate(), moment().toDate()])}>1H</Button>
                    <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                            onClick={() => onDateTimeRangeChange([moment().subtract(6, 'hours').toDate(), moment().toDate()])}>6H</Button>
                    <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                            onClick={() => onDateTimeRangeChange([moment().subtract(1, 'days').toDate(), moment().toDate()])}>1D</Button>
                    <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                            onClick={() => onDateTimeRangeChange([moment().subtract(1, 'weeks').toDate(), moment().toDate()])}>1W</Button>
                    <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                            onClick={() => onDateTimeRangeChange([moment().subtract(1, 'months').toDate(), moment().toDate()])}>1M</Button>
                    <Button style={{background: "white", border: '1px solid #E8E8E8', marginTop: 2}}
                            onClick={() => onDateTimeRangeChange([moment().subtract(3, 'months').toDate(), moment().toDate()])}>3M</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Grid>
            <Grid item xs={1} style={{ paddingRight: 0}}>
                <IconButton style={{marginTop: 1, marginLeft: 3, padding: 5, border: '1px solid #E8E8E8', background: 'white'}}
                    onClick={onRefresh}
                    size="lg"
                    icon={<ReloadIcon/>}/>
            </Grid>
        </Grid>
    )
}