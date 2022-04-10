import { ProviderType, ProviderTypeMapping, DatabaseType, DatabaseTypeMapping } from '../../commons/ProviderType';
import yaml = require('js-yaml');
import fs = require('fs');

/**
 * Container setup in AppConfig.
 */
class AppConfigContainer 
{
    provider: ProviderType;
    namespace?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
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
/**
 * Application configuration.
 */
class AppConfig {
    container: AppConfigContainer;
    database: AppConfigDatabase;
}

function getContainerProviderConfig(config: any): AppConfigContainer 
{
    const providerConfig = config['container'].provider;
    const provider = ProviderTypeMapping[providerConfig.type];
    switch(provider) {
        case ProviderType.KUBERNETES: return { provider: provider, namespace: providerConfig.namespace };
        case ProviderType.DOCKER: return { provider: provider };
        case ProviderType.AWSBATCH: return { provider: provider, region: providerConfig.region, accessKeyId: providerConfig.accessKeyId, secretAccessKey: providerConfig.secretAccessKey };
        default: throw new Error("Invalid container provider");
    }
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

function getAppConfig(): AppConfig 
{
    const config = yaml.load(fs.readFileSync('app-config/ntcore.yml', 'utf8'));
    return { 
        container: getContainerProviderConfig(config),
        database: getDatabtaseProviderConfig(config)
    };
}

export const appConfig = getAppConfig();