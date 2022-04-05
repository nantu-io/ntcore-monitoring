import { appConfig } from "../config/AppConfigProvider";
import { Pool } from "pg";

export default class TimeSeriesDatabaseClientProvider {
    /**
     * Database client instance;
     */
    private static _client: Pool;

    public static get(): Pool {
        return this._client || (this._client = new Pool(appConfig.timeSeriesDatabase.config));
    }
}
