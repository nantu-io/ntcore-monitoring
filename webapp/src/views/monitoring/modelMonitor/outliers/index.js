import React from 'react';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import BasicTable from "../components/basicTable";
import CardLayout from '../components/cardLayout';

const createRowData = (feature, type, outliersCount, stdDev, median, mean, min, max) => {
    return { feature, type, outliersCount, stdDev, median, mean, min, max };
}
export default function OutLierTab(props) {

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
    const { workspaceId } = props;
    return (
        <div>
            <InfoBar workspaceId={workspaceId} />
            <CardLayout>
                <LineChart data={[]} style={{ marginBottom: '10px' }} title={'Outliers'}/>
            </CardLayout>
            <BasicTable columns={columns} rows={[rows]}/>
        </div>
    )
}