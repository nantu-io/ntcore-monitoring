import os
from ntcore.monitor import Monitor


class MetricsCollector:
    """
    Proxy plugin to collect metrics
    """
    def __init__(self, monitor, target_port) -> None:
        self._monitor = monitor
        self._target_port = int(target_port)

    def request(self, flow):
        flow.request.host = "localhost"
        flow.request.port = self._target_port
        if not flow.request.url.endswith("predict"):
            return
        self._monitor.add_metric("Count", 1)

    def response(self, flow):
        if not flow.request.url.endswith("predict"):
            return
        if 200 <= flow.response.status_code < 300:
            latency = flow.response.timestamp_end - flow.request.timestamp_end
            self._monitor.add_metric("Latency", int(latency * 1000000))
        else:
            self._monitor.add_metric("Error", 1)


# Initialize configurable variables
backend_port = os.environ["DSP_BACKEND_PORT"]
workspace_id = os.environ["DSP_WORKSPACE_ID"]
mon_endpoint = os.environ["DSP_MONITORING_ENDPOINT"]

# Initialize monitor client
monitor_server = mon_endpoint if mon_endpoint.startswith("http://") else "http://" + mon_endpoint
monitor_client = Monitor(workspace_id, server=monitor_server)

# Intialize addon.
addons = [ MetricsCollector(monitor_client, backend_port) ]