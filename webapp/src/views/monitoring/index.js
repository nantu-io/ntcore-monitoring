import React from 'react';
import BaseLayout from '../baseLayout';
import MUIDataTable from "mui-datatables";
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';
import { fetchDataV1 } from '../../global.js';

const useStyles = () => ({
    root: { width: '100%' },
    table: { height: 500, marginTop: 20, marginBottom: 20 }
});

class Monitoring extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: null,
            loading: false,
            rowsSelected: [],
            rows: [['test', 'C123', 'test', 'ntcore', '2021-01-01 10:30:00']],
            // rows: []
        };
        this._createHyperLink = this._createHyperLink.bind(this);
        this._getColumns = this._getColumns.bind(this);
        this._fetchWorkspacesData = this._fetchWorkspacesData.bind(this);
    }

    componentDidMount() {
        this._fetchWorkspacesData();
    }

    _getColumns() {
        return [
            { name: 'name', label: 'Name', options: { customBodyRenderLite: this._createHyperLink, filter: false, sort: false, viewColumns: false }  },
            { name: 'workspaceId', label: 'Workspace Id' },
            { name: 'version', label: 'Version' },
            { name: 'createdAt', label: 'Created Date' }
        ];
    }

    _createHyperLink(index) {
        const { rows } = this.state;
        const name = rows[index] ? rows[index][0] : null;
        const id = rows[index] ? rows[index][1] : null;
        const href = `/dsp/console/monitoring/${id}`;
        return <Link color="inherit" href={href}>{name}</Link>
    }

    _fetchWorkspacesData() {
        return new Promise((resolve) => this.setState({loading: true}, resolve()))
            .then(() => fetchDataV1(`/dsp/api/v1/workspaces`))
            .then((res) => this.setState({ rows: res.data.map((rowInfo) => this._createRowData(rowInfo)) }), () => Promise.reject())
            .catch(this.props.onError)
            .finally(() => this.setState({loading: false}));
    }

    _createRowData(rowInfo) {
        const name = rowInfo["name"];
        const id = rowInfo["id"];
        const version = rowInfo["max_version"];
        const createdAt = (new Date(parseInt(rowInfo["created_at"]) * 1000)).toLocaleString();
        return [ name, id, version, createdAt ];
    }

    render() {
        const { classes } = this.props;

        const options = { 
            
        };

        const columns = this._getColumns();
        const { rows } = this.state;

        return (
            <BaseLayout index={3}>
                <div className={clsx(classes.root, classes.table)}>
                    <MUIDataTable 
                        title="Monitoring"
                        columns={columns}
                        options={options}
                        data={rows}
                    />
                </div>
            </BaseLayout>
        )
    }
}

export default withStyles(useStyles)(Monitoring);
