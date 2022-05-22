import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { appConfig, AWSClientConfig } from "../../config/AppConfigProvider";

export default class MonitoringClientProvider 
{
    /**
     * CloudWatch client instance;
     */
    private static _client: CloudWatchClient;

    public static get(): CloudWatchClient
    {
        const cloudwatchConfig = appConfig.monitoring.config as AWSClientConfig
        return this._client || (this._client = new CloudWatchClient(cloudwatchConfig));
    }
}