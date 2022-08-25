from fastapi import FastAPI

# Initialize Fast API server.
app = FastAPI()

@app.get("/health")
async def healthcheck():
    """
    Returns if the service is healthy
    """
    return {"status": "healthy"}