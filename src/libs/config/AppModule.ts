import { MonitoringProviderFactory } from "../../providers/monitoring/MonitoringProvider";

export const monitoringProvider = new MonitoringProviderFactory().createProvider();

export async function initialize()
{
    await monitoringProvider.initialize();
}