import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { appConfig, CloudWatchConfig } from "../../config/AppConfigProvider";

export default class MonitoringClientProvider 
{
    /**
     * CloudWatch client instance;
     */
    private static _client: CloudWatchClient;

    public static get(): CloudWatchClient
    {
        const cloudwatchConfig = appConfig.monitoring.config as CloudWatchConfig
        return this._client || (this._client = new CloudWatchClient(cloudwatchConfig));
    }
}