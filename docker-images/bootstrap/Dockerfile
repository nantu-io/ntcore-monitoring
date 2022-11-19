FROM python:3.8-slim

# Install gcc
RUN apt-get update -y && \
    apt-get install -y gcc

# Install required packages
COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip &&\
    pip install -r /tmp/requirements.txt

# Copy scripts into image
COPY docker-entrypoint.sh /usr/local/bin/
COPY main.py /usr/local/bin/
COPY serialized_model_handler.py /usr/local/bin/

# Set docker entrypoint
ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]