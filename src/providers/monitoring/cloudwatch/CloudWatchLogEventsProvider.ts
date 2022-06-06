import { LogEventsProvider, LogEvent, LogEventQueryContext } from '../LogEventsProvider';
import { CloudWatchLogsClient, FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';
import { appConfig } from '../../../libs/config/AppConfigProvider';

export default class CloudWatchLogEventsProvider implements LogEventsProvider
{
    private readonly _cloudWatchClient: CloudWatchLogsClient;
    private readonly _kinesisClient: KinesisClient;
    private readonly _textEncoder: TextEncoder;

    public constructor(cloudWatchClient: CloudWatchLogsClient, kinesisClient: KinesisClient) 
    {
        this._cloudWatchClient = cloudWatchClient;
        this._kinesisClient = kinesisClient;
        this._textEncoder = new TextEncoder();
    }

    /**
     * Provision cloudwatch resources.
     */
    public async provision(): Promise<void>
    {
        
    }

    /**
     * Puts log event into cloudwatch.
     * @param workspaceId workspace id
     */
    public async putEvents(workspaceId: string, event: LogEvent): Promise<void>
    {
        const logEvent = { ...event, timestamp: event.timestamp ?? Date.now() }
        const command = new PutRecordCommand({
            StreamName: appConfig.logging.streamProvider.name,
            Data: this._textEncoder.encode(JSON.stringify(logEvent)),
            PartitionKey: workspaceId
        });
        await this._kinesisClient.send(command);
    }

    /**
     * Searches log events from cloudwatch.
     * @param context log query context
     * @returns log events
     */
    public async getEvents(context: LogEventQueryContext): Promise<{events: LogEvent[], nextToken: string}>
    {
        const command = new FilterLogEventsCommand({
            logGroupName: appConfig.logging.provider.group,
            logStreamNames: [context.workspaceId],
            filterPattern: context.queryPattern,
            startTime: context.startTime ? Number(context.startTime) : null,
            endTime: context.endTime ? Number(context.endTime) : null,
            nextToken: context.nextToken,
        });
        const response = await this._cloudWatchClient.send(command);
        const events = response.events.map(e => {
            return { timestamp: e.timestamp, message: e.message }
        });
        return {events, nextToken: response.nextToken};
    }
}