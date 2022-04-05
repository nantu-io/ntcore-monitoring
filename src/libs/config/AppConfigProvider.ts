import { 
    ProviderType, 
    ProviderTypeMapping, 
    DatabaseType, 
    DatabaseTypeMapping, 
    TimeSeriesDatabaseType, 
    TimeSeriesDatabaseTypeMapping 
} from '../../commons/ProviderType';
import yaml = require('js-yaml');
import fs = require('fs');

/**
 * Container setup in AppConfig.
 */
class AppConfigContainer 
{
    provider: ProviderType;
    namespace?: string;
}
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

class AppConfigTimeSeriesDatabase 
{
    provider: TimeSeriesDatabaseType;
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
 * Application configuration.
 */
class AppConfig {
    container: AppConfigContainer;
    database: AppConfigDatabase;
    timeSeriesDatabase: AppConfigTimeSeriesDatabase
}

function getContainerProviderConfig(config: any): AppConfigContainer 
{
    const provider = ProviderTypeMapping[config['container'].provider.type];
    switch(provider) {
        case ProviderType.KUBERNETES: return { provider: provider, namespace: config['container'].provider.namespace };
        case ProviderType.DOCKER: return { provider: provider };
        default: throw new Error("Invalid container provider");
    }
}

function getDatabtaseProviderConfig(config: any): AppConfigDatabase 
{
    const provider = DatabaseTypeMapping[config['database'].provider.type];
    switch(provider) {
        case DatabaseType.SQLITE: return { provider: provider, path: config['database'].provider.path };
        case DatabaseType.POSTGRES: return getPostgresProviderConfig(provider, config);
        default: throw new Error("Invalid databse provider");
    }
}

function getTimeSeriesDatabaseProviderConfig(config: any): AppConfigTimeSeriesDatabase
{
    const provider = TimeSeriesDatabaseTypeMapping[config['timeseries_database'].provider.type];
    switch(provider) {
        case TimeSeriesDatabaseType.TIMESCALE: return getTimescaleDatabaseProviderConfig(provider, config);
        default: throw new Error("Invalid time series database provider");
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

function getTimescaleDatabaseProviderConfig(provider: TimeSeriesDatabaseType, config: any): AppConfigTimeSeriesDatabase 
{
    const providerConfig = config['timeseries_database'].provider.config;
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

function getAppConfig(): AppConfig 
{
    const config = yaml.load(fs.readFileSync('app-config/ntcore.yml', 'utf8'));
    return { 
        container: getContainerProviderConfig(config),
        database: getDatabtaseProviderConfig(config),
        timeSeriesDatabase: getTimeSeriesDatabaseProviderConfig(config),
    };
}

export const appConfig = getAppConfig();
