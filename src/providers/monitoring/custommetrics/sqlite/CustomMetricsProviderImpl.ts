import { ICustomMetricsProvider,CustomMetrics } from '../CustomMetricsProvider';
import {
    CUSTOMMETRICS_INITIALIZATION,
    CUSTOMMETRICS_CREATE,
    CUSTOMMETRICS_READ
} from './CustomMetricsQueries';
import Database = require("better-sqlite3");

export class SQLiteCustomMetricsProvider implements ICustomMetricsProvider 
{
    private _databaseClient: Database.Database
    /**
     * Create the database locally.
     */
    constructor(databaseClient: Database.Database) 
    {
        this._databaseClient = databaseClient;
    }

    public async initialize()
    {
        this._databaseClient.exec(CUSTOMMETRICS_INITIALIZATION);
    }
    /**
     * Create a new custom metrics.
     * @param custom_metrics CustomMetrics object.
     */
    public async create(custom_metrics: CustomMetrics): Promise<CustomMetrics>
    {
        this._databaseClient.prepare(CUSTOMMETRICS_CREATE).run({
            workspaceId: custom_metrics.workspaceId,
            name: custom_metrics.name,
            type: custom_metrics.type,
            timestamp: custom_metrics.timestamp,
            formula: custom_metrics.formula
        });
        return custom_metrics;
    }
    /**
     * Retrieve the custom metrics.
     * @param id CustomMetrics id.
     */
    public async read(workspaceId: string): Promise<CustomMetrics> 
    {
        const row = this._databaseClient.prepare(CUSTOMMETRICS_READ).get({ workspaceId: workspaceId });
        return {
            workspaceId: row.workspaceId, 
            name: row.name, 
            type: row.type, 
            timestamp: row.timestamp,
            formula: row.formula
        };
    }

}