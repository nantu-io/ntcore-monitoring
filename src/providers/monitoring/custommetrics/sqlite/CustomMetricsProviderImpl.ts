import { ICustomMetricsProvider, CustomMetrics } from '../CustomMetricsProvider';
import { NotFoundException } from '../../../../commons/Errors';
import yaml = require('js-yaml');
import fs = require('fs');
import Database = require("better-sqlite3");

/**
 * SQLite implementation of custom metrics CRUD.
 */
export class SQLiteCustomMetricsProvider implements ICustomMetricsProvider 
{
    private _databaseClient: Database.Database
    private _sql: unknown;
    /**
     * Create the database locally.
     */
    constructor(databaseClient: Database.Database) 
    {
        this._sql = yaml.load(fs.readFileSync('app-config/sql/sqlite/custom-metrics.yml', 'utf8'));
        this._databaseClient = databaseClient;
    }

    public async initialize()
    {
        this._databaseClient.transaction(() => {
            this._databaseClient.exec(this._sql['initialize']);
            this._sql['index'].forEach((index: string) => this._databaseClient.exec(index));
        })();
    }

    /**
     * Create a new custom metric.
     * @param customMetrics custom metric definition
     */
    public async create(customMetrics: CustomMetrics, userId: string): Promise<CustomMetrics>
    {
        const workspaceId = customMetrics.workspaceId;
        const name = customMetrics.name;
        const type = customMetrics.type;
        const timestamp = customMetrics.timestamp;
        const formula = customMetrics.formula;
        const currentEpochTime = Math.floor((new Date()).getTime()/1000);
        const entry = { workspaceId, name, type, timestamp, formula, userId, currentEpochTime };
        this._databaseClient.prepare(this._sql['create']).run(entry);

        return customMetrics;
    }
    
    /**
     * Returns a custom metric definition.
     * @param workspaceId workspace id
     * @param name custom metric name
     * @returns custom metric definition
     */
    public async read(workspaceId: string, name: string): Promise<CustomMetrics> 
    {
        const row = this._databaseClient.prepare(this._sql['read']).get({ workspaceId, name });
        if (!row) throw new NotFoundException();
        const type = row?.type;
        const timestamp = row?.timestamp;
        const formula = row?.formula;

        return { workspaceId, name, type, timestamp, formula };
    }

    /**
     * Returns a list of custom metric definitions.
     * @param workspaceId workspace id
     */
    public async list(workspaceId: string): Promise<CustomMetrics[]>
    {
        return this._databaseClient.prepare(this._sql['list']).all({ workspaceId })
        .map(row => ({
            workspaceId: row?.workspace_id,
            name: row?.name,
            type: row?.type,
            timestamp: row?.timestamp,
            formula: row?.formula
        }));
    }

    /**
     * Deletes a custom metric from workspace with the given metric name.
     * @param workspaceId workspace id
     * @param name metric name
     */
    public async delete(workspaceId: string, name: string, userId: string): Promise<void>
    {
        const currentEpochTime = Math.floor((new Date()).getTime()/1000);
        this._databaseClient.prepare(this._sql['delete']).run({workspaceId, name, userId, currentEpochTime});
    }
}