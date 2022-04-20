import { Request, Response } from 'express';
import { IllegalArgumentException } from '../commons/Errors';
import { monitoringProvider } from '../libs/config/AppModule';
import { Metric } from '../providers/monitoring/MonitoringProvider';

export class MonitoringController {

    constructor() 
    {
        this.writeTimeSeries = this.writeTimeSeries.bind(this);
        this.queryTimeSeries = this.queryTimeSeries.bind(this);
        this.uploadGroundTruth = this.uploadGroundTruth.bind(this);
    }

    /**
     * Endpoint to ingest timeseries data.
     * @param req Request object.
     * @param res Response object.
     * Example: curl -X POST \
     *      -H "Content-Type: application/json" \
     *      -d '{"workspaceId": "C123", "name": "test", value: 1.0 ,"timestamp": 1650426681000}' \
     *      localhost:8180/dsp/api/v1/monitoring/metrics
     */
    public async writeTimeSeries(req: Request<{}, {}, Metric, {}>, res: Response) 
    {
        try {
            const { workspaceId, name, value } = req.body;
            const timestamp = req.body.timestamp ?? Date.now();
            this.validateRequest(workspaceId, name, value);
            await monitoringProvider.create({workspaceId, name, value, timestamp});
            res.status(201).json({workspaceId, name, value, timestamp});
        } catch (err) {
            this.handleException(err, res);
        }
    }

    /**
     * Endpoint to ingest timeseries data.
     * @param req Request object.
     * @param res Response object.
     * Example: curl localhost:8180/dsp/api/v1/monitoring/{workspaceId}/metrics?name=metric&startTime=1650426680000&endTime=1650426682000
     */
    public async queryTimeSeries(
        req: Request<{workspaceId: string}, {}, {}, {name: string, startTime: number, endTime: number}>, 
        res: Response)
    {
        const { workspaceId } = req.params;
        const { name, startTime, endTime } = req.query;
        try {
            this.validateRequest(workspaceId, name);
            const metrics = await monitoringProvider.query(workspaceId, name, startTime, endTime);
            res.status(200).json({ metrics });
        } catch (err) {
            this.handleException(err, res);
        }
    }

    /**
     * Endpoint to ingest timeseries data.
     * @param req Request object.
     * @param res Response object.
     * Example: curl -X POST \
     *      -H "Content-Type: application/json" \
     *      -d '{"workspaceId": "C123", "inputData": "1", "groundTruth": "2", value: 1.0 ,"timestamp": 1650426681000}' \
     *      localhost:8180/dsp/api/v1/monitoring/performances
     */
    public async uploadGroundTruth(
        req: Request<{}, {}, {workspaceId: string, inputData: any, groundTruth: any, timestamp: number}, {}>, 
        res: Response) 
    {
        const { workspaceId, inputData, groundTruth } = req.body;
        try {
            this.validateRequest(workspaceId, inputData, groundTruth);
            const timestamp = req.body.timestamp ?? Date.now();
            await monitoringProvider.uploadGroundTruth(workspaceId, inputData, groundTruth, timestamp)
            res.status(200).json({ workspaceId, inputData, groundTruth, timestamp });
        } catch (err) {
            this.handleException(err, res);
        }
    }

    private validateRequest(...params: any[])
    {
        const invalidParams = params.filter(param => !param)
        if (invalidParams.length > 0) {
            throw new IllegalArgumentException();
        }
    }

    private handleException(err: Error, res: Response)
    {
        if (err instanceof IllegalArgumentException) {
            res.status(400).json({error: `Invalid input parameters: ${err}`});
        } else {
            res.status(500).json({error: `Unable process request: ${err}`});
        }
    }
}
