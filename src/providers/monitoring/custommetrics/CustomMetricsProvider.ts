import { appConfig } from "../../../libs/config/AppConfigProvider";
import { DatabaseType } from "../../../commons/ProviderType";
import { SQLiteCustomMetricsProvider } from "./sqlite/CustomMetricsProviderImpl";
import SQliteClientProvider from "../../../libs/client/SQLiteClientProvider";

/**
 * Custom Metrics class.
 */
export class CustomMetrics 
{
    workspaceId: string;
    name: string;
    type: "request" | "response";
    timestamp?: number;
    formula?: string;
}

export interface ICustomMetricsProvider 
{
    /**
     * Initialize custom metrics table.
     */
    initialize: () => Promise<void>;
    /**
     * Creates a new custom metric.
     */
    create: (custom_metrics: CustomMetrics) => Promise<CustomMetrics>;
    /**
     * Returns a custom metric definition.
     */
    read: (workspaceId: string, name: string) => Promise<CustomMetrics>;
    /**
     * Returns a list of custom metric definitions.
     */
    list: (workspaceId: string) => Promise<CustomMetrics[]>;
}

export class CustomMetricsProviderFactory
{
    /**
     * Create a provider for custom metrics.
     * @returns Experiment provider.
     */
    public createProvider(): ICustomMetricsProvider
    {
        const databaseType: DatabaseType = appConfig.database.provider;
        switch(databaseType) {
            case DatabaseType.SQLITE: return new SQLiteCustomMetricsProvider(SQliteClientProvider.get());
            default: throw new Error("Invalid provide type");
        }
    }
}