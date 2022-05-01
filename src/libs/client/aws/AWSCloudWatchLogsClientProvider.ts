import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { appConfig, CloudWatchConfig } from "../../config/AppConfigProvider";

export default class LogsClientProvider 
{
    /**
     * Container client instance;
     */
    private static _client: CloudWatchLogsClient;

    public static get(): CloudWatchLogsClient
    {
        const cloudwatchConfig = appConfig.monitoring.config as CloudWatchConfig
        return this._client || (this._client = new CloudWatchLogsClient(cloudwatchConfig));
    }
}