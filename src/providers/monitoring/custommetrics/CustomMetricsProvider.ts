import { appConfig } from "../../../libs/config/AppConfigProvider";
import { DatabaseType } from "../../../commons/ProviderType";
import { SQLiteCustomMetricsProvider } from "./sqlite/CustomMetricsProviderImpl";
//import { PostgresCustomMetricsProvider } from "./postgres/CustomMetricsProviderImpl";
import SQliteClientProvider from "../../../libs/client/SQLiteClientProvider";
//import PostgresClientProvider from "../../../libs/client/PostgresClientProvider";


/**
 * Custom Metrics class.
 */
 export class CustomMetrics 
 {
    workspaceId: string;
    name: string;
    type: string;
    timestamp?: number;
    formula?: string;
 }


export interface ICustomMetricsProvider 
{
    initialize: () => Promise<void>;
    /**
     * Create a new custom metric.
     */
    create: (custom_metrics: CustomMetrics) => Promise<CustomMetrics>;
    /**
     * Create a new custom metric.
     */
    read: (workspaceId: string) => Promise<CustomMetrics>;
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
            //case DatabaseType.POSTGRES: return new PostgresCustomMetricsProvider(PostgresClientProvider.get());
            default: throw new Error("Invalid provide type");
        }
    }
}