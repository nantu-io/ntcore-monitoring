import { AWSClientConfig } from "./AWSClientConfig";

/**
 * Database config definition.
 */
export class DatabaseProvider
{
    type: "sqlite" | "postgres" | "dynamodb";
    config: SQLiteClientConfig | PostgresClientConfig | AWSClientConfig;
}
/**
 * Postgres client config
 */
export class PostgresClientConfig
{
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
}
/**
 * SQLite client config
 */
export class SQLiteClientConfig
{
    path: string;
}