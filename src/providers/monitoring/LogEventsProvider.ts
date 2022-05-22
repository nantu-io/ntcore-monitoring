import CloudWatchClientProvider from "../../libs/client/aws/AWSCloudWatchLogsClientProvider";
import CloudWatchLogEventsProvider from "./cloudwatch/CloudWatchLogEventsProvider";
import KinesisClientProvider from "../../libs/client/aws/AWSKinesisClientProvider";

/**
 * Log event search context.
 */
export class LogEventWriteContext
{
    workspaceId: string;
    source: string;
    events: LogEvent[];
    sequenceToken?: string;
}

/**
 * Log event search context.
 */
export class LogEventQueryContext
{
    workspaceId: string;
    startTime: number;
    endTime: number;
    queryPattern?: string;
    nextToken?: string;
}
/**
 * Metric Class Definition.
 */
export class LogEvent 
{
    timestamp: number;
    message: string;
}
/**
 * Log events provider;
 */
export interface LogEventsProvider 
{
    /**
     * Initialize required resource.
     */
    provision: () => Promise<void>;
    /**
     * Write to time series db
     */
    putEvents: (workspaceId: string, event: LogEvent) => Promise<void>;
    /**
     * Search log events.
     */
    getEvents: (context: LogEventQueryContext) => Promise<LogEvent[]>;
}
/**
 * Log events provider factory.
 */
export class LogEventsProviderFactory
{
    /**
     * Create a provider for log events.
     * @returns log events provider.
     */
    public createProvider(): LogEventsProvider
    {
        return new CloudWatchLogEventsProvider(CloudWatchClientProvider.get(), KinesisClientProvider.get());
    }
}