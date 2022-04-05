import React, { useEffect, useState } from 'react';
import Summary from './summary';
import LineChart from './lineChart';
import moment from 'moment';
import { Box } from '@material-ui/core';
import { fetchDataWithParamsV1 } from '../../../../global';

export default function MonitorOverviewTable(props) {
    const fetchInterval = props.interval ?? 5;
    const workspaceId = props.workspaceId;
    const [timeData, setTimeData] = useState([]);

    const getRangeData = (id, from, to) => {
        return fetchDataWithParamsV1('/dsp/api/v1/metrics/read/range', { id, from, to });
    }

    const getLastTenMinuteData = () => {
        const from = moment().subtract(10, 'minutes').unix();
        const to = moment().unix();
        return getRangeData(workspaceId, from, to).then(res => {
            const data = (res.data?.data ?? []).map(dp => ({
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