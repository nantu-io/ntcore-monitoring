import { LogEventsProviderFactory } from "../../providers/monitoring/LogEventsProvider";
import { MonitoringProviderFactory } from "../../providers/monitoring/MonitoringProvider";
import { CustomMetricsProviderFactory } from "../../providers/monitoring/custommetrics/CustomMetricsProvider"

export const monitoringProvider = new MonitoringProviderFactory().createProvider();
export const logEventsProvider = new LogEventsProviderFactory().createProvider();
export const custommetricsProvider = new CustomMetricsProviderFactory().createProvider();

export async function initialize()
{
    await monitoringProvider.provision();
    await logEventsProvider.provision();
    await custommetricsProvider.initialize();
}