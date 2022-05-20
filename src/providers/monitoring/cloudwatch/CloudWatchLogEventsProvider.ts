import { LogEventsProvider, LogEvent } from '../LogEventsProvider';
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";

export default class CloudWatchLogEventsProvider implements LogEventsProvider
{
    private readonly _cloudWatchClient: CloudWatchLogsClient;

    public constructor(cloudWatchClient: CloudWatchLogsClient) 
    {
        this._cloudWatchClient = cloudWatchClient;
    }

    public async initialize(): Promise<void>
    {

    }

    /**
     * Creates metric line in cloudwatch.
     * @param event metric object.
     * @returns input metric object.
     */
    public async create(event: LogEvent): Promise<LogEvent>
    {
        return null;
    }

    /**
     * Retrieves timeseries data for a given metric.
     * @param context metric query context.
     * @returns timeseries data.
     */
    public async read(workspaceId: string): Promise<LogEvent[]>
    {
        return [];
    }
}