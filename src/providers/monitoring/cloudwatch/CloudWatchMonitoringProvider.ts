import { MonitoringProvider, Metric, MetricQueryContext, GroundTruthUploadContext } from '../MonitoringProvider';
import { CloudWatchClient, PutMetricDataCommand, GetMetricStatisticsCommand, Datapoint } from '@aws-sdk/client-cloudwatch';
import * as moment from 'moment';
import { IllegalArgumentException } from '../../../commons/Errors';

/**
 * Pre-defined periods, i.e., 1 min, 5 min, 1 hour, 1 day
 */
const periods = [60, 300, 3600, 86400];

export default class CloudWatchMonitoringProvider implements MonitoringProvider
{
    private readonly _cloudWatchClient: CloudWatchClient;

    public constructor(cloudWatchClient: CloudWatchClient) 
    {
        this._cloudWatchClient = cloudWatchClient;
    }

    public async provision(): Promise<void>
    {

    }

    /**
     * Creates metric line in cloudwatch.
     * @param metric metric object.
     * @returns input metric object.
     */
    public async create(metric: Metric): Promise<Metric>
    {
        const command = new PutMetricDataCommand({
            Namespace: metric.workspaceId,
            MetricData: [{
                MetricName: metric.name,
                Value: metric.value,
                Timestamp: new Date(metric.timestamp),
            }]
        });
        await this._cloudWatchClient.send(command);
        
        return metric;
    }

    /**
     * Retrieves timeseries data for a given metric.
     * @param context metric query context.
     * @returns timeseries data.
     */
    public async query(context: MetricQueryContext): Promise<Metric[]>
    {
        const startTime = Number(context.startTime);
        const endTime = Number(context.endTime);    
        const dateTimeRange = periods.find(p => Math.floor((endTime - startTime) / 1000 / p) <= 1440);
        if (!dateTimeRange) {
            throw new IllegalArgumentException("Time range too large");
        }
        const command = new GetMetricStatisticsCommand({
            Namespace: context.workspaceId,
            MetricName: context.name,
            StartTime: context.startTime ? new Date(startTime) : moment().subtract(1, 'days').toDate(),
            EndTime: context.endTime ? new Date(endTime) : new Date(),
            Period: context.period ? Math.floor(context.period * 60) : dateTimeRange, // seconds
            Statistics: [ this.getStatName(context.statistics) ]
        });
        const cloudWatchResponse = await this._cloudWatchClient.send(command);
        const metrics = cloudWatchResponse.Datapoints.map(d => {
            return {name: context.name, value: this.getStatValue(context.statistics, d), workspaceId: context.workspaceId, timestamp: d.Timestamp.getTime()}
        }).sort((m1, m2) => m1.timestamp - m2.timestamp);

        return metrics;
    }

    private getStatName(statistics: string): string
    {
        switch(statistics) {
            case "average"  : return "Average";
            case "maximum"  : return "Maximum";
            case "minimum"  : return "Minimum";
            case "sum"      : return "Sum";
            case "count"    : return "SampleCount";
            default         : return "Average";
        }
    }

    private getStatValue(statistics: string, datapoint: Datapoint): number
    {
        switch(statistics) {
            case "average"  : return datapoint.Average;
            case "maximum"  : return datapoint.Maximum;
            case "minimum"  : return datapoint.Minimum;
            case "sum"      : return datapoint.Sum;
            case "count"    : return datapoint.SampleCount;
            default         : return datapoint.Average;
        }
    }

    /**
     * Uploads input data and ground truth.
     * @param context ground truth upload context.
     */
    public async uploadGroundTruth(context: GroundTruthUploadContext) 
    {
        
    }
}
