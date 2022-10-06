FROM mitmproxy/mitmproxy:latest

# Install gcc
RUN apt-get update -y && \
    apt-get install -y gcc curl

# Install required packages
COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip &&\
    pip install -r /tmp/requirements.txt

# Copy scripts into image
COPY metrics_collector.py /usr/local/bin/