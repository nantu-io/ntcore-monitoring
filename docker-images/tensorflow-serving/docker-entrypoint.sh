#! /usr/bin/env sh

# Set env required for the base tensorflow/serving container
export MODEL_NAME=${DSP_WORKSPACE_ID}

# Execute python script to download model and start the metrics proxy
python3 /usr/local/bin/main.py