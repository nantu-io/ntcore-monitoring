import TimescaleProvider from "./TimescaleProvider";
import { appConfig } from "../../libs/config/AppConfigProvider";
import { TimeSeriesDatabaseType } from "../../commons/ProviderType";
import TimescaleClientProvider from "../../libs/client/TimeScaleClientProvider";

export class PredictMetrics {
    time: string;
    workspace_id: string;
    version: number;
    value: number;
}

export interface GenericMonitoringProvider {
     /**
     * Initialize required resource.
     */
    initialize: () => Promise<void>;
    /**
     * Write to time series db
     */
    write: (timestamp, id, version, value) => Promise<void>;
    /**
     * Query range data
     */
    readWithinRange: (id, from, to) => Promise<PredictMetrics[]>;
    /**
     * Upload ground truth
     */
    uploadGroundTruth: (workspaceId, inputData, groundTruth, timestamp) => Promise<void>;
}

export class MonitoringProviderFactory
{
    /**
     * Create a provider for monitoring.
     * @param type Provider type, e.g., LOCAL, AWS etc.
     * @returns Experiment provider.
     */
    public createProvider(): GenericMonitoringProvider
    {
        const providerType: TimeSeriesDatabaseType = appConfig.timeSeriesDatabase.provider;
        switch(providerType) {
            case TimeSeriesDatabaseType.TIMESCALE: return new TimescaleProvider(TimescaleClientProvider.get());
            default: throw new Error("Invalid time series database type");
        }
    }
}
