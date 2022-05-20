import { appConfig } from "../../libs/config/AppConfigProvider";
import { LogEventsProviderType } from "../../commons/ProviderType";
import CloudWatchClientProvider from "../../libs/client/aws/AWSCloudWatchLogsClientProvider";
import CloudWatchLogEventsProvider from "./cloudwatch/CloudWatchLogEventsProvider";

/**
 * Metric Class Definition.
 */
export class LogEvent 
{
    workspaceId: string;
    timestamp: number;
    content: string;
}
/**
 * Log events provider;
 */
export interface LogEventsProvider 
{
     /**
     * Initialize required resource.
     */
    initialize: () => Promise<void>;
    /**
     * Write to time series db
     */
    create: (event: LogEvent) => Promise<LogEvent>;
    /**
     * Query range data
     */
    read: (workspaceId: string) => Promise<LogEvent[]>;
}
/**
 * 
 */
export class LogEventsProviderFactory
{
    /**
     * Create a provider for monitoring.
     * @returns Experiment provider.
     */
    public createProvider(): LogEventsProvider
    {
        const providerType: LogEventsProviderType = appConfig.logging.provider;
        switch(providerType) {
            case LogEventsProviderType.CLOUDWATCH: return new CloudWatchLogEventsProvider(CloudWatchClientProvider.get());
            default: throw new Error("Invalid log events provider type");
        }
    }
}