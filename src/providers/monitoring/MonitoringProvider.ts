import { appConfig } from "../../libs/config/AppConfigProvider";
import { TimeSeriesDatabaseType } from "../../commons/ProviderType";
import TimescaleClientProvider from "../../libs/client/TimeScaleClientProvider";
import TimescaleMonitoringProvider from "./timescale/TimescaleMonitoringProvider";

/**
 * Metric Object.
 */
export class Metric 
{
    name: string;
    value: number;
    workspaceId: string;
    version: number;
    timestamp?: number;
}
/**
 * Prediction Object.
 */
export interface Prediction 
{
    workspaceId: string,
    version: number,
    inputData: any,
    result: any,
    timestamp?: number,
}

export interface MonitoringProvider 
{
     /**
     * Initialize required resource.
     */
    initialize: () => Promise<void>;
    /**
     * Write to time series db
     */
    create: (metric: Metric) => Promise<Metric>;
    /**
     * Query range data
     */
    query: (workspaceId: string, version: number, name: string, startTime: number, endTime: number) => Promise<Metric[]>;
    /**
     * Upload ground truth
     */
    uploadGroundTruth: (workspaceId: string, inputData: any, groundTruth: any, timestamp: number) => Promise<void>;
}

export class MonitoringProviderFactory
{
    /**
     * Create a provider for monitoring.
     * @returns Experiment provider.
     */
    public createProvider(): MonitoringProvider
    {
        const providerType: TimeSeriesDatabaseType = appConfig.timeSeriesDatabase.provider;
        switch(providerType) {
            case TimeSeriesDatabaseType.TIMESCALE: return new TimescaleMonitoringProvider(TimescaleClientProvider.get());
            default: throw new Error("Invalid timeseries database type");
        }
    }
}
