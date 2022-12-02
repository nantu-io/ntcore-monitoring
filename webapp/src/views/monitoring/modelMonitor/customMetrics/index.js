import React, { useEffect, useState } from 'react';
import { fetchDataWithParamsV1 } from '../../../../global';
import { Row, Col, Grid, Button} from 'rsuite';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CardLayout from '../components/cardLayout';
import moment from 'moment';

export default function CustomMetrics(props) 
{
    const workspaceId = props.workspaceId;
    const [customMetricsData, setCustomMetricsData] = useState([]);
    const [dateTimeRange, setDateTimeRange] = useState([]);

    const fetchMetricData = (workspaceId, name, startTime, endTime, statistics) => {
        return fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/metrics`, { name, startTime, endTime, statistics });
    }

    const fetchCustomMetrics = (workspaceId) => {
        return fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/customMetrics`);
    }

    const getCustomMetricData = async (name, statistics) => {
        const startTime = dateTimeRange[0]?.valueOf() ?? moment().subtract(1, 'days').format('x');
        const endTime =  dateTimeRange[1]?.valueOf() ?? moment().format('x');
        const res = await fetchMetricData(workspaceId, name, startTime, endTime, statistics);
        const data = (res.data?.metrics ?? []).map(dp => ({
            timestamp: moment(dp.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            value: dp.value
        }));
        return { name, data }
    }

    const setCustomMetrics = async () => {
        const customMetrics = await fetchCustomMetrics(workspaceId).data?.metrics;
        setCustomMetricsData(Promise.all(customMetrics.map(m => getCustomMetricData(m, 'average'))));
    }

    useEffect(() => {
        setCustomMetrics()
    }, [dateTimeRange]);

    return (
        <div>
            <Grid fluid style={{padding: 0, marginBottom: 10}}>
                <Row>
                    <Col><InfoBar workspaceId={workspaceId} onDateTimeRangeChange={setDateTimeRange} onRefresh={setCustomMetrics}/></Col>
                    <Col><Button appearance="primary" block>New metric</Button></Col>
                </Row>
            </Grid>
            <CardLayout>
                {customMetricsData.map(metric => 
                    <Grid item xs={6}>
                        <LineChart data={metric.data} title={metric.name}/>
                    </Grid>)}
            </CardLayout>
        </div>
    )
}