import { MonitoringProvider, Metric, Prediction, MetricQueryContext, GroundTruthUploadContext } from '../MonitoringProvider';
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
        const { workspaceId, name, value, timestamp } = metric;
        const formattedTimestamp = this.formatDateTime(timestamp);
        await this._pool.query(METRIC_CREATE, [workspaceId, name, value, formattedTimestamp]);
        return metric;
    }

    /**
     * Retrieves timeseries data for a given metric.
     * @param context metric query context.
     * @returns timeseries data.
     */
    public async query(context: MetricQueryContext): Promise<Metric[]>
    {
        if (context.startTime && context.endTime) {
            const formattedStartTime = this.formatDateTime(context.startTime);
            const formattedEndTime = this.formatDateTime(context.endTime);
            return (await this._pool.query(METRIC_READ_WITH_RANGE, [context.workspaceId, context.name, formattedStartTime, formattedEndTime])).rows;
        } else if (context.startTime) {
            const formattedStartTime = this.formatDateTime(context.startTime);
            return (await this._pool.query(METRIC_READ_WITH_START_TIME, [context.workspaceId, context.name, formattedStartTime])).rows;
        } else if (context.endTime) {
            const formattedEndTime = this.formatDateTime(context.endTime);
            return (await this._pool.query(METRIC_READ_WITH_END_TIME, [context.workspaceId, context.name, formattedEndTime])).rows;
        }
        return (await this._pool.query(METRIC_READ_WITHOUT_RANGE, [context.workspaceId, context.name])).rows;
    }

    /**
     * Uploads input data and ground truth.
     * @param context ground truth upload context.
     */
    public async uploadGroundTruth(context: GroundTruthUploadContext) 
    {
        // const formattedTimestamp = this.formatDateTime(context.timestamp);
        // TODO: Handle the ground truth request asynchronously via a queue.
        // const response = (await axios.post<Prediction>(`/s/${context.workspaceId}/predict`)).data;
        // await this._pool.query(PERFORMANCE_CREATE, [context.workspaceId, context.inputData, context.groundTruth, response.result, formattedTimestamp]);
    }

    private formatDateTime(epoch: number): string
    {
        return moment(epoch.toString(), 'x').format(DATETIME_FORMAT);
    }
}
