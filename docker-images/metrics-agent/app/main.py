from kubernetes import client, config
from ntcore.monitor import Monitor
import os, time

config.load_incluster_config()
api = client.CustomObjectsApi()

namespace = os.environ["DSP_MONITORING_NAMESPACE"]
endpoint = os.environ["DSP_MONITORING_ENDPOINT"]
seconds = os.environ["DSP_MONITORING_SECONDS"]
server = endpoint if endpoint.startswith("http://") or endpoint.startswith('https://') else "http://" + endpoint

while True:
    k8s_pods = api.list_namespaced_custom_object("metrics.k8s.io", "v1beta1", namespace, "pods")
    metrics = dict()
    
    for stats in k8s_pods['items']:
        pod_name = stats['metadata']['name']
        if not pod_name.startswith('ntcore-c'):
            continue

        workspace_id = pod_name.split('-')[1].upper()
        cpu_used = metrics[workspace_id]['cpu_used'] if workspace_id in metrics else 0
        mem_used = metrics[workspace_id]['mem_used'] if workspace_id in metrics else 0
        
        # Only sums the core container metrics
        container = next(filter(lambda c: c['name'].endswith('-core'), stats['containers']))
        cpu_used += int(container['usage']['cpu'][0:-1]) 
        mem_used += int(container['usage']['memory'][0:-2])

        # Updates cpu/memory metrics in the dict
        metrics[workspace_id] = { 'cpu_used': cpu_used, 'mem_used': mem_used }

    for item in metrics.items():
        # Inits ntcore monitor client for the given workspace
        monitor = Monitor(item[0], server=server)
        # Emits number of millicores, e.g. 5m (equivalent to 0.005 cpu).
        # 1 CPU unit is equivalent to 1 physical CPU core, or 1 virtual core, depending on whether the node is a physical host or a virtual machine running inside a physical machine.
        monitor.add_metric('Cpu', float(item[1]['cpu_used']) / (1000 * 1000))
        # Emits amount of memory in GB that a pod is using.
        monitor.add_metric('MemoryUsed', float(item[1]['mem_used']) / (1024 * 1024))

    time.sleep(int(seconds))