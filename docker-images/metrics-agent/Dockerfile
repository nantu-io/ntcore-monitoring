FROM python:3.8-slim

# Install required dependencies
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy app to the target destination
COPY ./app /app

# Go to app directory.
WORKDIR /app

# Start uvicorn server
CMD ["python", "main.py"]