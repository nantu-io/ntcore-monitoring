import { ICustomMetricsProvider, CustomMetrics } from '../CustomMetricsProvider';
import { NotFoundException } from '../../../../commons/Errors';
import yaml = require('js-yaml');
import fs = require('fs');
import Database = require("better-sqlite3");

const sql = yaml.load(fs.readFileSync('app-config/sql/sqlite/custom-metrics.yml', 'utf8'));

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
        this._databaseClient.exec(sql['initialization']);
    }

    /**
     * Create a new custom metric.
     * @param customMetrics custom metric definition
     */
    public async create(customMetrics: CustomMetrics): Promise<CustomMetrics>
    {
        const workspaceId = customMetrics.workspaceId;
        const name = customMetrics.name;
        const type = customMetrics.type;
        const timestamp = customMetrics.timestamp;
        const formula = customMetrics.formula;
        const entry = { workspaceId, name, type, timestamp, formula };
        this._databaseClient.prepare(sql['create']).run(entry);

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
        const row = this._databaseClient.prepare(sql['read']).get({ workspaceId, name });
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
        return this._databaseClient.prepare(sql['list']).all({ workspaceId })
        .map(row => ({
            workspaceId: row?.workspace_id,
            name: row?.name,
            type: row?.type,
            timestamp: row?.timestamp,
            formula: row?.formula
        }));
    }
}