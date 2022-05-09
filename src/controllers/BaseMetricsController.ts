import { Request, Response } from 'express';
import { monitoringProvider } from '../libs/config/AppModule';
import { Metric } from '../providers/monitoring/MonitoringProvider';
import { RequestValidator } from '../libs/utils/RequestValidator';
import { ErrorHandler } from '../libs/utils/ErrorHandler';

export class BaseMetricsController {

    constructor() 
    {
        this.writeTimeSeries = this.writeTimeSeries.bind(this);
        this.queryTimeSeries = this.queryTimeSeries.bind(this);
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
            RequestValidator.validateRequest(workspaceId, name, value);
            await monitoringProvider.create({workspaceId, name, value, timestamp});
            res.status(201).json({workspaceId, name, value, timestamp});
        } catch (err) {
            ErrorHandler.handleException(err, res);
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
            RequestValidator.validateRequest(workspaceId, name);
            const metrics = await monitoringProvider.query({workspaceId, name, startTime, endTime});
            res.status(200).json({ metrics });
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }
}
