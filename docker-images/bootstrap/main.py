import logging, os
from pathlib import Path
from ntcore import Client
from serialized_model_handler import TensorflowSerializedModelHandler, TorchSerializedModelHandler, SklearnSerializedModelHandler

# Retrieve env vars
workspace_id = os.environ["DSP_WORKSPACE_ID"]
api_endpoint = os.environ["DSP_API_ENDPOINT"]
# Initialize ntcore client
ntcore_server = api_endpoint if api_endpoint.startswith("http://") else "http://" + api_endpoint
ntcore_client = Client(server=ntcore_server)
serialized_model_handlers = dict(
    sklearn=SklearnSerializedModelHandler(ntcore_client),
    tensorflow=TensorflowSerializedModelHandler(ntcore_client),
    pytorch=TorchSerializedModelHandler(ntcore_client))

model_base_path = os.path.join("/models", workspace_id)
try:
    Path(model_base_path).mkdir(parents=True, exist_ok=True)
    registered_experiment = ntcore_client.get_registered_experiment(workspace_id)
    framework = registered_experiment['framework']
    serialized_model_handler = serialized_model_handlers[framework]
    serialized_model_handler.handle(model_base_path, workspace_id)

except Exception as e:
    logging.error("Failed loading model from {0}: {1}".format(ntcore_server, e))