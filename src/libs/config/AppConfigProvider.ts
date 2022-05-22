import { 
    DatabaseType, 
    DatabaseTypeMapping, 
    MonitoringProviderType, 
    MonitoringProviderTypeMapping
} from '../../commons/ProviderType';
import yaml = require('js-yaml');
import fs = require('fs');

/**
 * Database setup in AppConfig.
 */
class AppConfigDatabase
{
    provider: DatabaseType;
    path?: string;
    config?: {
        host: string;
        port: number;
        user: string;
        database: string;
        password: string;
    }
}
/**
 * Monitoring setup in AppConfig.
 */
class AppConfigMonitoring 
{
    provider: MonitoringProviderType;
    config?: TimeseriesDBConfig | AWSClientConfig;
}
/**
 * Monitoring setup in AppConfig.
 */
class AppConfigLogging
{
    provider: {
        type: "cloudwatch";
        group: string;
        config?: AWSClientConfig;
    };
    streamProvider?: {
        type: "kinesis" | "kafka";
        name: string;
        config?: AWSClientConfig;
    }
}
/**
 * Timeseries database setup in AppConfig.
 */
export class TimeseriesDBConfig 
{
    host: string;
    port: number;
    user: string;
    database: string;
    password: string;
}
/**
 * CloudWatch setup in AppConfig.
 */
export class AWSClientConfig 
{
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}
/**
 * Application configuration.
 */
class AppConfig 
{
    database: AppConfigDatabase;
    monitoring: AppConfigMonitoring;
    logging: AppConfigLogging;
}

function getDatabtaseProviderConfig(config: any): AppConfigDatabase 
{
    const providerConfig = config['database'].provider;
    const provider = DatabaseTypeMapping[providerConfig.type];
    switch(provider) {
        case DatabaseType.SQLITE: return { provider: provider, path: providerConfig.path };
        case DatabaseType.POSTGRES: return getPostgresProviderConfig(provider, config);
        default: throw new Error("Invalid databse provider");
    }
}

function getMonitoringProviderConfig(config: any): AppConfigMonitoring
{
    const provider = MonitoringProviderTypeMapping[config['monitoring'].provider.type];
    switch(provider) {
        case MonitoringProviderType.TIMESCALE: return getTimeseriesDBProviderConfig(provider, config);
        case MonitoringProviderType.CLOUDWATCH: return getCloudWatchMetricsConfig(provider, config);
        default: throw new Error("Invalid monitoring provider");
    }
}

function getPostgresProviderConfig(provider: DatabaseType, config: any): AppConfigDatabase 
{
    const providerConfig = config['database'].provider.config;
    return { 
        provider: provider, 
        config: {
            host: providerConfig.host,
            port: providerConfig.port,
            user: providerConfig.user,
            database: providerConfig.database,
            password: providerConfig.password,
        }
    };
}

function getTimeseriesDBProviderConfig(provider: MonitoringProviderType, config: any): AppConfigMonitoring 
{
    const providerConfig = config['monitoring'].provider.config;
    return { 
        provider: provider, 
        config: {
            host: providerConfig.host,
            port: providerConfig.port,
            user: providerConfig.user,
            database: providerConfig.database,
            password: providerConfig.password,
        }
    };
}

function getCloudWatchMetricsConfig(provider: MonitoringProviderType, config: any): AppConfigMonitoring
{
    const providerConfig = config['monitoring'].provider.config;
    return { 
        provider: provider,
        config: {
            region: providerConfig.region,
            accessKeyId: providerConfig.accessKeyId,
            secretAccessKey: providerConfig.secretAccessKey
        }
    };
}

function getLogEventsProviderConfig(config: any): AppConfigLogging
{
    const provider = config['logging'].provider;
    const streamProvider = config['logging'].streamProvider;
    return { 
        provider: {
            type: provider.type,
            group: provider.group,
            config: {
                region: provider.config.region,
                accessKeyId: provider.config.accessKeyId,
                secretAccessKey: provider.config.secretAccessKey
            }
        },
        streamProvider: {
            type: streamProvider.type,
            name: streamProvider.name,
            config: {
                region: streamProvider.config.region,
                accessKeyId: streamProvider.config.accessKeyId,
                secretAccessKey: streamProvider.config.secretAccessKey
            }
        }
    };
}

function getAppConfig(): AppConfig 
{
    const config = yaml.load(fs.readFileSync('app-config/monitoring.yml', 'utf8'));
    return { 
        database: getDatabtaseProviderConfig(config),
        monitoring: getMonitoringProviderConfig(config),
        logging: getLogEventsProviderConfig(config)
    };
}

export const appConfig = getAppConfig();
