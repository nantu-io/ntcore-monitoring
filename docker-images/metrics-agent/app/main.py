from kubernetes import client, config
from ntcore.monitor import Monitor
import os, time

config.load_incluster_config()
api = client.CustomObjectsApi()

endpoint = os.environ["DSP_MONITORING_ENDPOINT"]
server = endpoint if endpoint.startswith("http://") or endpoint.startswith('https://') else "http://" + endpoint
monitors = {}

while True:
    k8s_pods = api.list_cluster_custom_object("metrics.k8s.io", "v1beta1", "pods")
    
    for stats in k8s_pods['items']:
        pod_name = stats['metadata']['name']
        if not pod_name.startswith('ntcore-c'):
            continue

        containers = stats['containers']
        cpu_used = 0
        mem_used = 0
        for container in containers:
            cpu_used += int(container['usage']['cpu'][0:-1])
            mem_used += int(container['usage']['memory'][0:-2])

        workspace_id = pod_name.split('-')[1].upper()
        if workspace_id in monitors:
            monitor = monitors[workspace_id]
        else:
            monitor = Monitor(workspace_id, server=server)
            monitors[workspace_id] = monitor
            
        monitor.add_metric('Cpu', cpu_used)
        monitor.add_metric('MemoryUsed', mem_used)

        time.sleep(60)
        