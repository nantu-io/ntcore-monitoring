import { LogEventsProviderFactory } from "../../providers/monitoring/LogEventsProvider";
import { MonitoringProviderFactory } from "../../providers/monitoring/MonitoringProvider";

export const monitoringProvider = new MonitoringProviderFactory().createProvider();
export const logEventsProvider = new LogEventsProviderFactory().createProvider();

export async function initialize()
{
    await monitoringProvider.provision();
    await logEventsProvider.provision();
}