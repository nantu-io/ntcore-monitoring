import { WorkpaceProviderFactory } from "../../providers/workspace/GenericWorkspaceProvider";
import { ExperimentProviderFactory } from "../../providers/experiment/GenericExperimentProvider";
import { DeploymentProviderFactory } from "../../providers/deployment/GenericDeploymentProvider";
import { ServiceStateProviderFactory } from "../../providers/container/ServiceProviderFactory";
import { MonitoringProviderFactory } from "../../providers/monitoring/GenericMonitoringProvider";

export const workspaceProvider = new WorkpaceProviderFactory().createProvider();
export const experimentProvider = new ExperimentProviderFactory().createProvider();
export const deploymentProvider = new DeploymentProviderFactory().createProvider();
export const monitoringProvider = new MonitoringProviderFactory().createProvider();
export const serviceStateProvider = new ServiceStateProviderFactory().createProvider();

export async function initialize() {
    await workspaceProvider.initialize();
    await experimentProvider.initialize();
    await deploymentProvider.initialize();
    await serviceStateProvider.initialize();
    await monitoringProvider.initialize();
}