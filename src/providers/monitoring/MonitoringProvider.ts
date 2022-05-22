import { appConfig } from "../../libs/config/AppConfigProvider";
import { MonitoringProviderType } from "../../commons/ProviderType";
import TimescaleClientProvider from "../../libs/client/TimeScaleClientProvider";
import TimescaleMonitoringProvider from "./timescale/TimescaleMonitoringProvider";
import CloudWatchMonitoringProvider from "./cloudwatch/CloudWatchMonitoringProvider";
import CloudWatchClientProvider from "../../libs/client/aws/AWSCloudWatchClientProvider";

/**
 * Metric Query Context.
 */
export class MetricQueryContext
{
    workspaceId: string;
    name: string;
    startTime: number;
    endTime: number;
    period?: number; // minutes
    statistics?: "average" | "maximum" | "minimum" | "sum" | "count"
}
/**
 * Ground Truth Upload Context.
 */
export class GroundTruthUploadContext
{
    workspaceId: string;
    inputData: any;
    groundTruth: any;
    timestamp: number;
}
/**
 * Metric Class Definition.
 */
export class Metric 
{
    name: string;
    value: number;
    workspaceId: string;
    unit?: string;
    timestamp?: number;
}
/**
 * Prediction Class Definition.
 */
export interface Prediction 
{
    workspaceId: string,
    inputData: any,
    result: any,
    timestamp?: number,
}

export interface MonitoringProvider 
{
    /**
     * Initialize required resource.
     */
    provision: () => Promise<void>;
    /**
     * Write to time series db
     */
    create: (metric: Metric) => Promise<Metric>;
    /**
     * Query range data
     */
    query: (context: MetricQueryContext) => Promise<Metric[]>;
    /**
     * Upload ground truth
     */
    uploadGroundTruth: (context: GroundTruthUploadContext) => Promise<void>;
}

export class MonitoringProviderFactory
{
    /**
     * Create a provider for monitoring.
     * @returns Experiment provider.
     */
    public createProvider(): MonitoringProvider
    {
        const providerType: MonitoringProviderType = appConfig.monitoring.provider;
        switch(providerType) {
            case MonitoringProviderType.TIMESCALE: return new TimescaleMonitoringProvider(TimescaleClientProvider.get());
            case MonitoringProviderType.CLOUDWATCH: return new CloudWatchMonitoringProvider(CloudWatchClientProvider.get());
            default: throw new Error("Invalid timeseries database type");
        }
    }
}
