# NTCore Monitoring: SaaS for ML/AI Model Monitoring

![workflows-intro](https://user-images.githubusercontent.com/42594415/146384196-7ff6edcb-b30d-4daf-b878-822a5ddcae73.jpg)

![Docker Image Version (latest by date)](https://img.shields.io/docker/v/ntcore/monitoring)
![Docker Automated build](https://img.shields.io/docker/automated/ntcore/monitoring)
![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
![PyPI](https://img.shields.io/pypi/v/ntcore)
![GitHub last commit](https://img.shields.io/github/last-commit/nantu.io/ntcore-monitoring)


## Deployment SOP

1. Create a dedicated cloudwatch log group for customer.
2. Create a dedicated kinesis stream for customer.
3. Update kube/ntcore/monitoring.yml with the cloudwatch log group and kinesis stream name, for example,
    ```
    provider:
        type: cloudwatch
        group: /ntcore/monitoring/dev
        ...
    streamProvider:
        type: kinesis
        name: log-event-stream-dev
        ...
    ```
4. Update kube/ntcore/log-events-processor.yml with the cloudwatch log group and kinesis stream name, for example,
    ```
    kclpy.properties: |
        streamName = {kinesis_stream_for_customer}
        applicationName = {application_name_for_customer}
        ...
    cloudwatch.properties: |
        [CloudWatch]
        logGroup = {log_group_for_customer}
        ...
    ```
5. Apply the kubernetes configs.

## Documentation
NTCore documentation: https://nantu-io.github.io/ntcore-doc.

- [Quickstart](https://nantu-io.github.io/ntcore-doc/#/quick_start)
- [Production](https://nantu-io.github.io/ntcore-doc/#/production)
- [Examples](https://github.com/nantu-io/ntcore/tree/promotion/client/examples)

## Community
For Getting Started guides, tutorials, and API reference check out our docs.

To report a bug, file a documentation issue, or submit a feature request, please open a GitHub issue.

## License
NTCore is licensed under [Apache 2.0](https://github.com/nantu-io/ntcore/blob/main/LICENSE).
