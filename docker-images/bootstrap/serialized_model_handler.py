from abc import ABC, abstractmethod
from ntcore import Client
import os, tarfile


class SerializedModelHandler(ABC):
    """
    Defines the protocal to handle the serialized model file
    """
    def __init__(self, ntcore_client: Client) -> None:
        super().__init__()
        self._ntcore_client = ntcore_client

    @abstractmethod
    def handle(self, base_path: str, workspace_id: str):
        pass


class TensorflowSerializedModelHandler(SerializedModelHandler):
    """
    Handles tensorflow model download and extract.
    """
    def handle(self, base_path, workspace_id):
        model_path = os.path.join(base_path, "model.tar.gz")
        self._ntcore_client.download_model(model_path, workspace_id)

        # Unzip the file to get the original saved model
        with tarfile.open(model_path, "r:gz") as tar:
            tar.extractall(base_path)
        # Remove the binary model file
        os.remove(model_path)
        # tensorflow-serving requires version in number format
        os.rename(os.path.join(base_path, 'model'), os.path.join(base_path, "1"))


class SklearnSerializedModelHandler(SerializedModelHandler):
    """
    Handles sklearn model download and extract.
    """
    def handle(self, base_path, workspace_id):
        model_path = os.path.join(base_path, "model.pkl")
        print(model_path)
        self._ntcore_client.download_model(model_path, workspace_id)


class TorchSerializedModelHandler(SerializedModelHandler):
    """
    Handles pytorch model download and extract.
    """
    def handle(self, base_path, workspace_id):
        model_path = os.path.join(base_path, "model.mar")
        self._ntcore_client.download_model(model_path, workspace_id)