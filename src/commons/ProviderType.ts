export const enum ProviderType {
    /**
     * Deploy instances locally with docker.
     */
    DOCKER = "DOCKER",
    /**
     * Deploy instances in Kubernetes cluster.
     */
    KUBERNETES = "KUBERNETES",
    /**
     * Deploy instances in AWS 
     */
    AWS = "AWS",
    /**
     * Deploy instances in AliCloud 
     */
    ALICLOUD = "ALICLOUD",
}
/**
 * Provider type mapping.
 */
export const ProviderTypeMapping = {
    /**
     * Docker.
     */
    "docker": ProviderType.DOCKER,
    /**
     * Kubernetes.
     */
    "kubernetes": ProviderType.KUBERNETES,
    /**
     * AWS.
     */
    "aws": ProviderType.AWS,
    /**
     * Ali cloud.
     */
    "alicloud": ProviderType.ALICLOUD,
}
/**
 * Database types.
 */
export const enum DatabaseType {
    /**
     * Local database type.
     */
    SQLITE = "SQLITE",
    /**
     * Postgres SQL.
     */
    POSTGRES = "POSTGRES",
}
/**
 * Database types mapping.
 */
 export const DatabaseTypeMapping = {
    /**
     * Docker.
     */
     "sqlite": DatabaseType.SQLITE,
     /**
      * Kubernetes.
      */
     "postgres": DatabaseType.POSTGRES,
}

export const enum TimeSeriesDatabaseType {
    /**
     * Timescale
     */
    TIMESCALE = "TIMESCALE",
}

export const TimeSeriesDatabaseTypeMapping = {
    /**
     * Timescale
     */
    "timescale": TimeSeriesDatabaseType.TIMESCALE,
}