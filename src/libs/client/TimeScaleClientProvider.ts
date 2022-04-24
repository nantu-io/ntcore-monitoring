import { appConfig, TimeseriesDBConfig } from "../config/AppConfigProvider";
import { Pool } from "pg";

export default class TimeSeriesDatabaseClientProvider {
    /**
     * Database client instance;
     */
    private static _client: Pool;

    public static get(): Pool
    {
        const timeseriesDBConfig = appConfig.monitoring.config as TimeseriesDBConfig
        return this._client || (this._client = new Pool(timeseriesDBConfig));
    }
}
