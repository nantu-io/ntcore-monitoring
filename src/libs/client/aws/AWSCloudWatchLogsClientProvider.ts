import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { appConfig, AWSClientConfig } from "../../config/AppConfigProvider";

export default class LogsClientProvider 
{
    /**
     * Container client instance;
     */
    private static _client: CloudWatchLogsClient;

    public static get(): CloudWatchLogsClient
    {
        const cloudwatchConfig = appConfig.monitoring.config as AWSClientConfig
        return this._client || (this._client = new CloudWatchLogsClient(cloudwatchConfig));
    }
}