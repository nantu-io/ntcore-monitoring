import React from 'react';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import BasicTable from "../components/basicTable";
import CardLayout from '../components/cardLayout';
import { makeStyles } from '@material-ui/core/styles';
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

const createRowData = (feature, type, outliersCount, stdDev, median, mean, min, max) => {
    return { feature, type, outliersCount, stdDev, median, mean, min, max };
}
export default function OutLierTab() {
    const classes = useStyles();

    const _getColumns = () => {
        return [
            { name: 'feature', label: 'Feature' },
            { name: 'type', label: 'Type' },
            { name: 'outliersCount', label: 'Outliers Count' },
            { name: 'stdDev', label: 'Std Dev' },
            { name: 'median', label: 'Median' },
            { name: 'mean', label: 'Mean' },
            { name: 'min', label: 'Min' },
            { name: 'max', label: 'Max' }
        ];
    }

    const columns = _getColumns();

    const rows = createRowData('age', 'input', 75, 18.1, 60.7, 42.5, 0.01, 99);
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
                <LineChart data={[]} style={{ marginBottom: '10px' }} title={'Outliers'}/>
            </CardLayout>
            <BasicTable columns={columns} rows={[rows]}/>
        </div>
    )
}