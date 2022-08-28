FROM tensorflow/serving:latest

# Install python3
RUN apt-get update -y && \
    apt-get install -y python3-pip curl

# Install required packages
COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --upgrade pip &&\
    pip3 install -r /tmp/requirements.txt

# Copy scripts into image
COPY main.py /usr/local/bin/

# Health check service
HEALTHCHECK --interval=5s --timeout=5m \
    CMD curl -f http://localhost:8080/v1/models/$DSP_WORKSPACE_ID || exit 1

# Execute the base tensorflow serving entrypoint
CMD ["python", "/usr/local/bin/main.py"]