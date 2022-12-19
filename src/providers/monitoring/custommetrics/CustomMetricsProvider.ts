import { appConfig } from "../../../libs/config/AppConfigProvider";
import { SQLiteCustomMetricsProvider } from "./sqlite/CustomMetricsProviderImpl";
import { DynamoDBCustomMetricsProvider } from "./dynamodb/CustomMetricsProviderImpl";
import SQliteClientProvider from "../../../libs/client/SQLiteClientProvider";
import DynamoDBClientProvider from "../../../libs/client/aws/DynamoDBClientProvider";

/**
 * Type to indicate if metrics are derived from request/response object.
 */
export type CustomMetricsType = "request" | "response";
/**
 * Custom Metrics class.
 */
export class CustomMetrics 
{
    workspaceId: string;
    name: string;
    type: CustomMetricsType;
    timestamp?: number;
    formula: string;
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
    create: (customMetrics: CustomMetrics, userId: string) => Promise<CustomMetrics>;
    /**
     * Returns a custom metric definition.
     */
    read: (workspaceId: string, name: string) => Promise<CustomMetrics>;
    /**
     * Returns a list of custom metric definitions.
     */
    list: (workspaceId: string) => Promise<CustomMetrics[]>;
    /**
     * Deletes a custom metrics with a given workspace id and metric name.
     */
    delete: (workspaceId: string, name: string, userId: string) => Promise<void>;
}

export class CustomMetricsProviderFactory
{
    /**
     * Create a provider for custom metrics.
     * @returns Experiment provider.
     */
    public createProvider(): ICustomMetricsProvider
    {
        switch(appConfig.database.type) {
            case "sqlite": return new SQLiteCustomMetricsProvider(SQliteClientProvider.get());
            case "dynamodb": return new DynamoDBCustomMetricsProvider(DynamoDBClientProvider.get());
            default: throw new Error("Invalid provider type.");
        }
    }
}