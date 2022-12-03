import { ICustomMetricsProvider, CustomMetrics, CustomMetricsType } from '../CustomMetricsProvider';
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { NotFoundException } from '../../../../commons/Errors';

const TABLE_NAME = "CustomMetrics";
const WORKSPACE_ID_IS_DELETED_INDEX_NAME = "workspace_id-is_deleted-index";

/**
 * DynamoDB implementation of custom metrics CRUD.
 */
export class DynamoDBCustomMetricsProvider implements ICustomMetricsProvider 
{
    private _databaseClient: DynamoDBClient;
    /**
     * Initialize the experiments table.
     */
    constructor(databaseClient: DynamoDBClient) 
    {
        this._databaseClient = databaseClient;
    }

    public async initialize() {}

    /**
     * Create a new custom metric.
     * @param customMetrics custom metric definition
     */
    public async create(customMetrics: CustomMetrics, userId: string): Promise<CustomMetrics>
    {
        const currentEpochTime = Math.floor((new Date()).getTime()/1000);
        const entry = {
            workspace_id: { S: customMetrics.workspaceId },
            name        : { S: customMetrics.name },
            type        : { S: customMetrics.type },
            timestamp   : { N: customMetrics.timestamp?.toString() },
            formula     : { S: customMetrics.formula },
            is_deleted  : { N: "0" },
            created_by  : { S: userId },
            created_at  : { N: currentEpochTime.toString() },
            last_mod_by : { S: userId },
            last_mod_at : { N: currentEpochTime.toString() },
        }
        await this._databaseClient.send(new PutItemCommand({ TableName: TABLE_NAME, Item: entry }));
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
        const item = (await this._databaseClient.send(new GetItemCommand({
            TableName: TABLE_NAME,
            Key: { workspace_id: { S: workspaceId }, name: { S: name }}
        })))?.Item;
        if (!item || item.is_deleted.N === "1") throw new NotFoundException();
        return {
            workspaceId : workspaceId,
            name        : item?.name.S,
            type        : item?.type.S as CustomMetricsType,
            timestamp   : Number(item?.timestamp.N),
            formula     : item?.formula.S,
        }
    }

    /**
     * Returns a list of custom metric definitions.
     * @param workspaceId workspace id
     */
    public async list(workspaceId: string): Promise<CustomMetrics[]>
    {
        const command =  new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: WORKSPACE_ID_IS_DELETED_INDEX_NAME,
            KeyConditionExpression: `workspace_id = :workspaceId AND is_deleted = :isDeleted`,
            ExpressionAttributeValues: { ":workspaceId": { S: workspaceId }, ":isDeleted": { N: "0" } }
        });
        return (await this._databaseClient.send(command)).Items?.map((item: any) => ({
            workspaceId : workspaceId,
            name        : item?.name.S,
            type        : item?.type.S as CustomMetricsType,
            timestamp   : Number(item?.timestamp.N),
            formula     : item?.formula.S
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
        const command = new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: { workspace_id: { S: workspaceId }, name: { S: name }},
            UpdateExpression: "set is_deleted=:isDeleted, last_mod_by=:lastModBy, last_mod_at=:lastModAt",
            ExpressionAttributeValues: { ":isDeleted": { N: "1" }, ":lastModBy": {S: userId}, ":lastModAt": {N: currentEpochTime.toString()} }
        });
        await this._databaseClient.send(command);
    }
}