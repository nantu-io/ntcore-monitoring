import React, { useEffect, useState } from 'react';
import Summary from '../components/summary';
import LineChart from '../components/lineChart';
import InfoBar from '../components/infoBar';
import CardLayout from '../components/cardLayout';
import DateTimeRangePicker from '../components/dateTimeRangePicker';
import moment from 'moment';
import { fetchDataWithParamsV1 } from '../../../../global';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
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

export default function MonitorOverviewTable(props)
{
    const fetchInterval = props.interval ?? 5;
    const workspaceId = props.workspaceId;
    const [timeData, setTimeData] = useState([]);
    const classes = useStyles();

    const getRangeData = (workspaceId, name, startTime, endTime) => {
        return fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/metrics`, { name, startTime, endTime });
    }

    const getLastTenMinuteData = async () => {
        const startTime = moment().subtract(10, 'minutes').format('x');
        const endTime = moment().format('x');
        const name = "test";
        const res = await getRangeData(workspaceId, name, startTime, endTime);
        const data = (res.data?.metrics ?? []).map(dp => ({
            value: dp.value,
            timestamp: moment(dp.timestamp).format('x')
        }));
        setTimeData(data);
    }

    useEffect(() => {
        const timer = setInterval(() => getLastTenMinuteData(), fetchInterval * 1000);
        return () => clearInterval(timer);
    });  

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
                <Summary />
            </CardLayout>
            <CardLayout>
                <LineChart data={timeData} title={'Live Predictions'}/>
            </CardLayout>
        </div>
    )
}