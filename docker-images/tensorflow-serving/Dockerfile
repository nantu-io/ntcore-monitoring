FROM tensorflow/serving

# Install python3
RUN apt-get update -y && \
    apt-get install -y python3.8 python3-pip curl

# Install required packages
RUN pip3 install requests setuptools-rust proxy.py &&\
    pip3 install --upgrade pip &&\
    pip3 install ntcore

# Copy scripts into image
COPY main.py /usr/local/bin/

# Health check service
HEALTHCHECK --interval=5s --timeout=5m \
    CMD curl -f http://localhost:8080/v1/models/$DSP_WORKSPACE_ID || exit 1

# Execute the base tensorflow serving entrypoint
CMD ["python", "/usr/local/bin/main.py"]