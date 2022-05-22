import { KinesisClient } from "@aws-sdk/client-kinesis";
import { appConfig, AWSClientConfig } from "../../config/AppConfigProvider";

export default class LogStreamClientProvider 
{
    /**
     * Container client instance;
     */
    private static _client: KinesisClient;

    public static get(): KinesisClient
    {
        const clientConfig = appConfig.logging.streamProvider.config as AWSClientConfig
        return this._client || (this._client = new KinesisClient(clientConfig));
    }
}