import { appConfig } from "../config/AppConfigProvider";
import { SQLiteClientConfig } from "../config/DatabaseProvider";
import Database = require("better-sqlite3");

export default class SQliteClientProvider 
{
    /**
     * Database client instance;
     */
    private static _client: Database.Database;

    public static get(): Database.Database 
    {
        const config = appConfig.database.config as SQLiteClientConfig
        return this._client || (this._client = Database(config.path, {}));
    }
}