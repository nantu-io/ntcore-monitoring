import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fetchDataWithParamsV1 } from '../../../../global';
import { DateRangePicker } from 'rsuite';
import { Table, Row, Col, Input, InputGroup, Grid, Pagination, Button } from 'rsuite';
import clsx from 'clsx';
import moment from 'moment';
import SearchIcon from '@rsuite/icons/Search';
import 'rsuite/dist/rsuite.min.css';

const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        padding: '0px 0px',
        background: 'white'
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

const CompactCell = props => <Table.Cell {...props} style={{ padding: 8, fontSize: 14 }} />;
const CompactHeaderCell = props => <Table.HeaderCell {...props} style={{ padding: 8 }} />;

export default function LogEventsDisplay(props) 
{
    const classes = useStyles();
    const { workspaceId } = props;
    // const [events, setEvents] = useState([{'timestamp': '2022-05-23', message:'hello-world'}]);
    const [events, setEvents] = useState([]);
    const [queryPattern, setQueryPattern] = useState("");
    const [nextToken, setNextToken] = useState(null);
    const [limit, setLimit] = React.useState(100);
    const [page, setPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dateTimeRange, setDateTimeRange] = useState([moment().subtract(1, 'months').toDate(), moment().toDate()]);
    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };
    const paginatedEvents = events.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    });

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
            width: 1000
        }
    ];

    const fetchEvents = async (workspaceId, startTime, endTime, queryPattern, nextToken) => {
        const res = await fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/events`, { startTime, endTime, queryPattern, nextToken });
        const data = (res.data?.events ?? []).map(event => ({
            message: event.message,
            timestamp: moment(event.timestamp).format('YYYY-MM-DD HH:mm:ss')
        }));
        return [data, res.data?.nextToken]
    }

    const setEventData = async (workspaceId, dateTimeRange, queryPattern, nextToken) => {
        const startTime = dateTimeRange[0]?.valueOf();
        const endTime = dateTimeRange[1]?.valueOf();
        try {
            setIsLoading(true);
            const [fetched, token] = await fetchEvents(workspaceId, startTime, endTime, queryPattern, nextToken);
            if (nextToken) {
                setEvents([...events, ...fetched]);
            } else {
                setEvents(fetched);
            }
            setNextToken(token);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setEventData(workspaceId, dateTimeRange, queryPattern, null);
    }, []);

    return (
        <div className={clsx(classes.root)}>
            <Grid fluid>
                <Row>
                    <Col xs={24} sm={12} md={8}>
                        <DateRangePicker
                            format="yyyy-MM-dd HH:mm:ss"
                            cleanable
                            defaultValue={[moment().subtract(1, 'months').toDate(), moment().toDate()]}
                            style={{width: 500, marginBottom: 5, marginTop: 5}}
                            onChange={(range) => { 
                                setDateTimeRange(range);
                                setEventData(workspaceId, range, queryPattern, null);
                            }}
                            onClean={() => {
                                setDateTimeRange([]);
                                setEventData(workspaceId, [], queryPattern, null);
                            }}/>
                    </Col>
                    <Col xs={24} sm={12} md={8} style={{width: 800}}>
                        <InputGroup {...props} style={{marginBottom: 5, marginTop: 5}}>
                            <Input onChange={(value) => setQueryPattern(value)}/>
                            <InputGroup.Addon>
                                <SearchIcon style={{cursor: "pointer"}}
                                    onClick={() => setEventData(workspaceId, dateTimeRange, queryPattern, null)}/>
                            </InputGroup.Addon>
                        </InputGroup>
                    </Col>
                </Row>
            </Grid>
            <Table
                loading={isLoading}
                virtualized
                height={300}
                hover={true}
                fillHeight={false}
                showHeader={true}
                autoHeight={true}
                data={paginatedEvents}
                bordered={true}
                cellBordered={false}
                headerHeight={38}
                rowHeight={38}>
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
                    disabled={events.length > 0 && !nextToken}
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
                    limitOptions={[50, 100, 500]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                />
            </div>
        </div>
    )
}