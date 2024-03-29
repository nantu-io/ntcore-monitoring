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
    AWSBATCH = "AWSBATCH",
    /**
     * Deploy instances in AWS 
     */
    AWSECS = "AWSECS",
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
     * AWS Batch.
     */
    "awsbatch": ProviderType.AWSBATCH,
    /**
     * AWS ECS.
     */
     "awsecs": ProviderType.AWSECS,
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

export const enum MonitoringProviderType 
{
    /**
     * Timescale
     */
    TIMESCALE = "TIMESCALE",
    /**
     * AWS CloudWatch
     */
    CLOUDWATCH = "CLOUDWATCH",
}

export const MonitoringProviderTypeMapping = {
    /**
     * Timescale
     */
    "timescale": MonitoringProviderType.TIMESCALE,
    /**
     * AWS CloudWatch
     */
    "cloudwatch": MonitoringProviderType.CLOUDWATCH,
}