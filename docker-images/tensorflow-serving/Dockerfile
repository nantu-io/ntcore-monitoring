FROM tensorflow/serving:latest

# Install python3
RUN apt-get update -y && \
    apt-get install -y python3.8 python3-pip curl

# Install required packages
COPY requirements.txt /tmp/requirements.txt
RUN python3.8 -m pip install --upgrade pip &&\
    python3.8 -m pip install -r /tmp/requirements.txt

# Copy scripts into image
COPY docker-entrypoint.sh /usr/local/bin/
COPY main.py /usr/local/bin/

# Health check service
HEALTHCHECK --interval=5s --timeout=5m \
    CMD curl -f http://localhost:8080/v1/models/$DSP_WORKSPACE_ID || exit 1

# Expose the listen port
EXPOSE 18080

# Set docker entrypoint
ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]