import { MonitoringProvider, Metric, Prediction } from '../MonitoringProvider';
import { Pool } from "pg";
import axios from 'axios';
import * as moment from 'moment';
import {
    METRICS_INITIALIZATION,
    METRICS_HYPERTABLE_INITIALIZATION,
    PERFORMANCES_INITIALIZATION,
    PERFORMANCES_HYPERTABLE_INITIALIZATION,
    METRIC_CREATE,
    METRIC_READ_WITH_RANGE,
    METRIC_READ_WITH_START_TIME,
    METRIC_READ_WITH_END_TIME,
    METRIC_READ_WITHOUT_RANGE,
    PERFORMANCE_CREATE
} from "./TimeSeriesQueries";

const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export default class TimescaleMonitoringProvider implements MonitoringProvider 
{
    private readonly _pool: Pool;

    public constructor(pool: Pool) 
    {
        this._pool = pool;
    }

    public async initialize(): Promise<void>
    {
        await this._pool.query(METRICS_INITIALIZATION);
        await this._pool.query(METRICS_HYPERTABLE_INITIALIZATION);
        await this._pool.query(PERFORMANCES_INITIALIZATION);
        await this._pool.query(PERFORMANCES_HYPERTABLE_INITIALIZATION);
    }

    /**
     * Creates metric line in timeseries database.
     * @param metric metric object.
     * @returns input metric object.
     */
    public async create(metric: Metric): Promise<Metric>
    {
        const { workspaceId, version, name, value, timestamp } = metric;
        const formattedTimestamp = this.formatDateTime(timestamp);
        await this._pool.query(METRIC_CREATE, [workspaceId, version, name, value, formattedTimestamp]);
        return metric;
    }

    /**
     * Retrieves timeseries data for a given metric.
     * @param workspaceId workspace id.
     * @param version model version.
     * @param name metric name.
     * @param startTime start timestamp.
     * @param endTime end timestamp.
     * @returns timeseries data.
     */
    public async query(workspaceId: string, version: number, name: string, startTime: number, endTime: number)
    {
        if (startTime && endTime) {
            const formattedStartTime = this.formatDateTime(startTime);
            const formattedEndTime = this.formatDateTime(endTime);
            return (await this._pool.query(METRIC_READ_WITH_RANGE, [workspaceId, version, name, formattedStartTime, formattedEndTime])).rows;
        } else if (startTime) {
            const formattedStartTime = this.formatDateTime(startTime);
            return (await this._pool.query(METRIC_READ_WITH_START_TIME, [workspaceId, version, name, formattedStartTime])).rows;
        } else if (endTime) {
            const formattedEndTime = this.formatDateTime(endTime);
            return (await this._pool.query(METRIC_READ_WITH_END_TIME, [workspaceId, version, name, formattedEndTime])).rows;
        }
        return (await this._pool.query(METRIC_READ_WITHOUT_RANGE, [workspaceId, version, name])).rows;
    }

    /**
     * Uploads input data and ground truth.
     * @param workspaceId workspace id.
     * @param inputData input data.
     * @param groundTruth ground truth for comparison.
     * @param timestamp request timestamp.
     */
    public async uploadGroundTruth(workspaceId: string, inputData: any, groundTruth: any, timestamp: number) 
    {
        const formattedTimestamp = this.formatDateTime(timestamp);
        const response = (await axios.post<Prediction>(`/s/${workspaceId}/predict`)).data;
        await this._pool.query(PERFORMANCE_CREATE, [workspaceId, response.version, inputData, groundTruth, response.result, formattedTimestamp]);
    }

    private formatDateTime(epoch: number): string
    {
        return moment.unix(epoch).format(DATETIME_FORMAT);
    }
}
