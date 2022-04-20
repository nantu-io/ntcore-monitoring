import React, { useEffect, useState } from 'react';
import Summary from './summary';
import LineChart from './lineChart';
import moment from 'moment';
import { Box } from '@material-ui/core';
import { fetchDataWithParamsV1 } from '../../../../global';

export default function MonitorOverviewTable(props) 
{
    const fetchInterval = props.interval ?? 5;
    const workspaceId = props.workspaceId;
    const [timeData, setTimeData] = useState([]);

    const getRangeData = (workspaceId, name, startTime, endTime) => {
        return fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/metrics`, { name, startTime, endTime });
    }

    const getLastTenMinuteData = () => {
        const startTime = moment().subtract(10, 'minutes').format('x');
        const endTime = moment().format('x');
        const name = "test";
        return getRangeData(workspaceId, name, startTime, endTime).then(res => {
            const data = (res.data?.metrics ?? []).map(dp => ({
                ...dp,
                time: moment(dp.time).format('LTS')
            }));
            setTimeData(data);
        });
    }

    useEffect(() => {
        const timer = setInterval(() => getLastTenMinuteData(), fetchInterval * 1000);
        return () => clearInterval(timer);
    }, []);  

    return (
        <Box>
            <Summary />
            <LineChart data={timeData} />
        </Box>
    )
}