from ntcore import Client
from pathlib import Path
from mitmproxy import options
from mitmproxy.tools import dump
from subprocess import Popen, PIPE
from ntcore.monitor import Monitor
import logging, tarfile, os, asyncio


class MetricsCollector:
    """
    Proxy plugin to collect metrics
    """
    def __init__(self, monitor, target_port) -> None:
        self._monitor = monitor
        self._target_port = target_port

    def request(self, flow):
        flow.request.port = self._target_port
        if not flow.request.url.endswith('/predict'):
            return
        self._monitor.add_metric("Count", 1)

    def response(self, flow):
        if not flow.request.url.endswith('/predict'):
            return
        if 200 <= flow.response.status_code < 300:
            latency = flow.response.timestamp_end - flow.request.timestamp_end
            self._monitor.add_metric("Latency", int(latency * 1000000))
        else:
            self._monitor.add_metric("Error", 1)


async def start_proxy(host, port, addons):
    """
    Start proxy with metrics collection plugin
    """
    master = dump.DumpMaster(
        options.Options(listen_host=host, listen_port=port),
        with_termlog=False,
        with_dumper=False,
    )
    for addon in addons:
        master.addons.add(addon)
    
    await master.run()
    return master


def download_model(ntcore_client, workspace_id):
    """
    Downloads model from ntcore server and place in the serving path.
    """
    try:
        extract_path = os.path.join("/models", workspace_id)
        model_path = os.path.join(extract_path, "model.tar.gz")
        Path(extract_path).mkdir(parents=True, exist_ok=True)
        # download model from ntcore
        ntcore_client.download_model(model_path, workspace_id)
        # Unzip the file to get the original saved model
        with tarfile.open(model_path, "r:gz") as tar:
            tar.extractall(extract_path)
        # Remove the binary model file
        os.remove(model_path)
        # tensorflow-serving requires version in number format
        os.rename(os.path.join(extract_path, 'model'), os.path.join(extract_path, "1"))

    except Exception as e:
        logging.error("Failed loading model from {0}: {1}".format(ntcore_server, e))


if __name__ == '__main__':
    # Initialize configurable variables
    listen_host = "0.0.0.0"
    listen_port = 8080
    target_port = 8081
    # Fetches environment variables
    workspace_id = os.environ["DSP_WORKSPACE_ID"]
    api_endpoint = os.environ["DSP_API_ENDPOINT"]
    mon_endpoint = os.environ["DSP_MONITORING_ENDPOINT"]

    # Initialize ntcore client with given server url
    ntcore_server = api_endpoint if api_endpoint.startswith("http://") else "http://" + api_endpoint
    # Initialize ntcore client
    ntcore_client = Client(server=ntcore_server)
    # download_model(ntcore_client, workspace_id)
    # Initialize monitor client
    monitor_server = mon_endpoint if mon_endpoint.startswith("http://") else "http://" + mon_endpoint
    monitor_client = Monitor(workspace_id, server=monitor_server)
    # Start server with Popen.
    proc = Popen(["uvicorn server:app --host {0} --port {1}".format(listen_host, target_port)], shell=True, stdout=PIPE, stderr=PIPE)
    asyncio.run(start_proxy(listen_host, listen_port, [ MetricsCollector(monitor_client, target_port) ]))