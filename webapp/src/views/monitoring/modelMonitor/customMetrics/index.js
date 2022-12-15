import React, { useEffect, useState } from 'react';
import { fetchDataWithParamsV1, postDataV1, deleteDataV1 } from '../../../../global';
import { Row, Col, Button, Modal, Form, Input, SelectPicker, IconButton} from 'rsuite';
import { Grid } from '@material-ui/core';
import CardLayout from '../components/cardLayout';
import InfoBar from '../components/infoBar';
import LineChart from '../components/lineChart';
import CloseIcon from '@rsuite/icons/Close';
import moment from 'moment';

const metricsType = ["request", "response"].map(item => ({ label: item, value: item }));

export default function CustomMetrics(props)
{
    const workspaceId = props.workspaceId;
    const [customMetricsData, setCustomMetricsData] = useState([]);
    const [dateTimeRange, setDateTimeRange] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [metricName, setMetricName] = useState("");
    const [metricType, setMetricType] = useState("request");
    const [metricFormula, setMetricFormula] = useState();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchMetricsData = async (workspaceId, name, startTime, endTime, statistics) => {
        try {
            const res = await fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/metrics`, { name, startTime, endTime, statistics });
            return (res?.data?.metrics ?? []).map(dp => ({ timestamp: moment(dp.timestamp).format('YYYY-MM-DD HH:mm:ss'), value: dp.value }));;
        } catch (Exception) {
            return [];
        }
    }

    const fetchCustomMetrics = async (workspaceId) => {
        try {
            const res = await fetchDataWithParamsV1(`/dsp/api/v1/monitoring/${workspaceId}/customMetrics`);
            return res?.data ?? [{name: 'test'}];
        } catch (Exception) {
            return [];
        }
    }

    const getCustomMetricData = async (name, statistics) => {
        const startTime = dateTimeRange[0]?.valueOf() ?? moment().subtract(1, 'days').format('x');
        const endTime =  dateTimeRange[1]?.valueOf() ?? moment().format('x');
        const data = await fetchMetricsData(workspaceId, name, startTime, endTime, statistics);
        return { name, data };
    }

    const setCustomMetrics = async () => {
        const metrics = await fetchCustomMetrics(workspaceId);
        const promises = metrics.map(metric => getCustomMetricData(metric.name, 'average'));
        const metricsData = await Promise.all(promises);
        setCustomMetricsData(metricsData);
    }

    const handleSubmit = async () => {
        await postDataV1(`/dsp/api/v1/monitoring/${workspaceId}/customMetrics`, {name: metricName, type: metricType, formula: metricFormula});
        await setCustomMetrics()
        setOpen(false);
    }

    const handleDelete = async (name) => {
        await deleteDataV1(`/dsp/api/v1/monitoring/${workspaceId}/customMetrics/${name}`);
        await setCustomMetrics()
    }

    useEffect(() => {
        setCustomMetrics()
    }, [dateTimeRange]);

    return (
        <div>
            <Grid fluid style={{padding: 0, marginBottom: 10}}>
                <Row>
                    <Col><InfoBar workspaceId={workspaceId} onDateTimeRangeChange={setDateTimeRange} onRefresh={setCustomMetrics}/></Col>
                    <Col><Button appearance="primary" block onClick={handleOpen}>New metric</Button></Col>
                </Row>
            </Grid>
            <CardLayout>
                <Grid container spacing={3}>
                    {customMetricsData.map(metric => 
                        <Grid item xs={6}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: -30}}>
                                <div style={{fontSize: 20}}></div>
                                <IconButton icon={<CloseIcon/>} onClick={() => handleDelete(metric.name)}/>
                            </div>
                            <LineChart data={metric.data} title={metric.name}/>
                        </Grid>)}
                </Grid>
            </CardLayout>
            <Modal open={open} onClose={handleClose} overflow={true} style={{marginTop: 60}}>
                <Modal.Header>
                    <Modal.Title style={{fontSize: 20}}>Add Custom Metric</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form fluid>
                    <Form.Group controlId="metricName">
                        <Form.ControlLabel>Name</Form.ControlLabel>
                        <Input onChange={(value) => setMetricName(value)}/>
                    </Form.Group>
                    <Form.Group controlId="metricType">
                        <Form.ControlLabel>Type</Form.ControlLabel>
                        <SelectPicker data={metricsType} searchable={false} defaultValue={"request"} onSelect={(value) => setMetricType(value) } block/>
                    </Form.Group>
                    <Form.Group controlId="formula">
                        <Form.ControlLabel>Formula</Form.ControlLabel>
                        <Input as="textarea" rows={10} onChange={(value) => setMetricFormula(value)}/>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit} appearance="primary">Confirm</Button>
                    <Button onClick={handleClose} appearance="subtle">Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}