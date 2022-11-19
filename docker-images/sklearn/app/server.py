from fastapi import FastAPI
from pydantic import BaseModel
import pickle, os

class Request(BaseModel):
    """
    Defines schema of the request object.
    """
    instances: list

# Retrieve env vars
workspace_id = os.environ["DSP_WORKSPACE_ID"]
# Read the serialized model from disk into memory
classifier = pickle.load(open('/models/{0}/model.pkl'.format(workspace_id), 'rb'))

# Initialize Fast API server.
app = FastAPI()

@app.post("/v1/models/predict")
async def predict(request: Request):
    """
    Returns the prediction from the model
    """
    return { "prediction": classifier.predict(request.instances).tolist() }

@app.get("/v1/models/healthcheck")
async def healthcheck():
    """
    Returns if the service is healthy
    """
    return {"status": "healthy"}