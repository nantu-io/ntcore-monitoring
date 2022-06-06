import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fetchDataWithParamsV1 } from '../../../../global';
import { DateRangePicker } from 'rsuite';
import { Table, Row, Col, Input, InputGroup, Grid, Pagination, Button, IconButton } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';
import clsx from 'clsx';
import moment from 'moment';
import SearchIcon from '@rsuite/icons/Search';
import 'rsuite/dist/rsuite.min.css';

const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        padding: '0px 0px',
    },
    buttonGroup: {
        '& > *': {
            marginTop: theme.spacing(3),
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(1),
        },
    },
    logs: {
        backgroundColor: '#eeeeee',
        whiteSpace: 'nowrap',
    },
    table: {
        height: 500,
    }
}));

const columns = [
    {
        key: 'timestamp',
        label: 'Timestamp',
        fixed: true,
        width: 200
    },
    {
        key: 'message',
        label: 'Message',
        fixed: true,
        width: "82%"
    }
];

const rowKey = "id";
const CompactCell = props => <Table.Cell {...props} style={{ padding: 8, fontSize: 14 }} />;
const CompactHeaderCell = props => <Table.HeaderCell {...props} style={{ padding: 8 }} />;
const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
    <Table.Cell {...props}>
      <IconButton
        size="xs"
        appearance="subtle"
        onClick={() => {
          onChange(rowData);
        }}
        icon={
          expandedRowKeys.some((key) => key === rowData[rowKey]) ? "-" : "+"
        }
      />
    </Table.Cell>
);
const renderRowExpanded = (event) => {
    return (<p style={{fontSize: 14}}>{event.message}</p>);
};
  
export default function LogEventsDisplay(props) 
{
    const classes = useStyles();
    const { workspaceId } = props;
    //const [events, setEvents] = useState([{'id': 1, 'timestamp': '2022-05-23', message:'hello-world'}, {'id': 2, 'timestamp': '2022-05-23', message:'hello-world'}]);
    const [events, setEvents] = useState([]);
    const [queryPattern, setQueryPattern] = useState("");
    const [nextToken, setNextToken] = useState(null);
    const [limit, setLimit] = React.useState(50);
    const [page, setPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dateTimeRange, setDateTimeRange] = useState([moment().subtract(1, 'months').toDate(), moment().toDate()]);
    const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };
    const paginatedEvents = events.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    });

    const fetchEvents = async (workspaceId, startTime, endTime, queryPattern, nextToken) => {
        const res = await fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/events`, { startTime, endTime, queryPattern, nextToken });
        const data = (res.data?.events ?? []).map((event, index) => ({
            message: event.message,
            timestamp: moment(event.timestamp).format('YYYY-MM-DD HH:mm:ss')
        }));
        return [data, res.data?.nextToken]
    }

    const setEventData = async (workspaceId, dateTimeRange, queryPattern, sequenceToken) => {
        const startTime = dateTimeRange[0]?.valueOf();
        const endTime = dateTimeRange[1]?.valueOf();
        try {
            setIsLoading(true);
            const [fetched, nextSequenceToken] = await fetchEvents(workspaceId, startTime, endTime, queryPattern, sequenceToken);
            const nextEvents = sequenceToken ? [...events, ...fetched] : fetched;
            setEvents(nextEvents.map((event, index) => ({ ...event, id: index })));
            setNextToken(fetched && fetched.length > 0 ? nextSequenceToken : null);
        } finally {
            setIsLoading(false);
        }
    }

    const handleExpanded = (rowData, dataKey) => {
        var open = false;
        const nextExpandedRowKeys = [];
        expandedRowKeys.forEach((key) => {
          if (key === rowData[rowKey]) open = true;
          else nextExpandedRowKeys.push(key);
        });
        if (!open) nextExpandedRowKeys.push(rowData[rowKey]);
        setExpandedRowKeys(nextExpandedRowKeys);
    };

    useEffect(() => {
        setEventData(workspaceId, dateTimeRange, queryPattern, null);
    }, []);

    return (
        <div className={clsx(classes.root)}>
            <Grid fluid style={{padding: 0, marginBottom: 10}}>
                <Row>
                    <Col xs={6} sm={6} md={6}>
                        <DateRangePicker
                            format="MM/dd/yyyy HH:mm"
                            cleanable
                            defaultValue={[moment().subtract(1, 'months').toDate(), moment().toDate()]}
                            value={dateTimeRange}
                            onChange={(range) => { 
                                setEventData(workspaceId, range, queryPattern, null);
                                setDateTimeRange(range);
                            }}
                            onClean={() => {
                                setEventData(workspaceId, [], queryPattern, null);
                                setDateTimeRange([]);
                            }}/>
                    </Col>
                    <Col xs={12} sm={12} md={12} style={{width: '70%', marginLeft: -5}}>
                        <InputGroup {...props}>
                            <Input onChange={(value) => setQueryPattern(value)}/>
                            <InputGroup.Addon>
                                <SearchIcon style={{cursor: "pointer"}}
                                    onClick={() => setEventData(workspaceId, dateTimeRange, queryPattern, null)}/>
                            </InputGroup.Addon>
                        </InputGroup>
                    </Col>
                    <Col xs={1} style={{paddingLeft: 0}}>
                        <IconButton style={{marginTop: 1, marginLeft: 3, padding: 5, border: '1px solid #E8E8E8', background: 'white'}}
                            onClick={() => setEventData(workspaceId, dateTimeRange, queryPattern, null)}
                            size="lg"
                            icon={<ReloadIcon/>}/>
                    </Col>
                </Row>
            </Grid>
            <Table
                loading={isLoading}
                virtualized
                height={400}
                data={paginatedEvents}
                bordered={true}
                headerHeight={38}
                rowHeight={38}
                rowKey={rowKey}
                expandedRowKeys={expandedRowKeys}
                renderRowExpanded={renderRowExpanded}>
                <Table.Column width={35} align="center">
                    <CompactHeaderCell>#</CompactHeaderCell>
                    <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} style={{padding: 0, paddingTop: 5}}/>
                </Table.Column>
                {columns.map(column => {
                    const { key, label, ...rest } = column;
                    return (
                        <Table.Column {...rest} key={key}>
                            <CompactHeaderCell>{label}</CompactHeaderCell>
                            <CompactCell dataKey={key} />
                        </Table.Column>
                    );
                })}
            </Table>
            <div style={{ padding: 20, paddingLeft: 12 }}>
                <Button 
                    appearance="link" 
                    disabled={(events.length > 0 && !nextToken) || isLoading}
                    style={{paddingLeft: 0}}
                    onClick={() => setEventData(workspaceId, dateTimeRange, queryPattern, nextToken)}>Load more</Button>
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={10}
                    size="xs"
                    layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                    total={events.length}
                    limitOptions={[10, 25, 50]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                />
            </div>
        </div>
    )
}