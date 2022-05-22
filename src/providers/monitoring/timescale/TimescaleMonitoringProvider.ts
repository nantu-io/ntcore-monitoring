import { MonitoringProvider, Metric, MetricQueryContext, GroundTruthUploadContext } from '../MonitoringProvider';
import { Pool } from "pg";
import * as moment from 'moment';
import {
    METRICS_INITIALIZATION,
    METRICS_HYPERTABLE_INITIALIZATION,
    PERFORMANCES_INITIALIZATION,
    PERFORMANCES_HYPERTABLE_INITIALIZATION,
    METRIC_CREATE,
    METRIC_READ_AVG,
    METRIC_READ_MAX,
    METRIC_READ_MIN,
    METRIC_READ_SUM,
    METRIC_READ_COUNT,
} from "./TimeSeriesQueries";

const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export default class TimescaleMonitoringProvider implements MonitoringProvider 
{
    private readonly _pool: Pool;

    public constructor(pool: Pool) 
    {
        this._pool = pool;
    }

    public async provision(): Promise<void>
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
        const query = this.getQueryForStats(context.statistics)
            .replace("$PERIOD", context.period ? Math.floor(context.period).toString() : "5")
            .replace("$START_TIME", context.startTime ? `AND timestamp >= '${this.formatDateTime(context.startTime)}'` : "")
            .replace("$END_TIME", context.endTime ? ` AND timestamp < '${this.formatDateTime(context.endTime)}'` : "");
        
        const rows = (await this._pool.query(query, [context.workspaceId, context.name])).rows;
        return rows.map(r => { return { workspaceId: context.workspaceId, name: context.name, value: r.value, timestamp: r.bucket } });
    }

    private getQueryForStats(statistics: string): string
    {
        switch(statistics) {
            case "average"  : return METRIC_READ_AVG;
            case "maximum"  : return METRIC_READ_MAX;
            case "minimum"  : return METRIC_READ_MIN;
            case "sum"      : return METRIC_READ_SUM;
            case "count"    : return METRIC_READ_COUNT;
            default         : return METRIC_READ_AVG;;
        }
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
