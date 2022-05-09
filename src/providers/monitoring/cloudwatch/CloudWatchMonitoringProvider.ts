import { MonitoringProvider, Metric, MetricQueryContext, GroundTruthUploadContext } from '../MonitoringProvider';
import { CloudWatchClient, PutMetricDataCommand, GetMetricStatisticsCommand } from '@aws-sdk/client-cloudwatch';
import * as moment from 'moment';

export default class CloudWatchMonitoringProvider implements MonitoringProvider
{
    private readonly _cloudWatchClient: CloudWatchClient;

    public constructor(cloudWatchClient: CloudWatchClient) 
    {
        this._cloudWatchClient = cloudWatchClient;
    }

    public async initialize(): Promise<void>
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
        const command = new GetMetricStatisticsCommand({
            Namespace: context.workspaceId,
            MetricName: context.name,
            StartTime: context.startTime ? new Date(context.startTime) : moment().subtract(1, 'days').toDate(),
            EndTime: context.endTime ? new Date(context.endTime) : new Date(),
            Period: context.period ? Math.floor(context.period * 60) : 300, // seconds
            Statistics: [ this.getStatistics(context.statistics) ]
        });
        const cloudWatchResponse = await this._cloudWatchClient.send(command);
        const metrics = cloudWatchResponse.Datapoints.map(d => {
            return {name: context.name, value: d.Average, workspaceId: context.workspaceId, timestamp: d.Timestamp.getTime()}
        });

        return metrics;
    }

    private getStatistics(statistics: string): string
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

    /**
     * Uploads input data and ground truth.
     * @param context ground truth upload context.
     */
    public async uploadGroundTruth(context: GroundTruthUploadContext) 
    {
        
    }
}
