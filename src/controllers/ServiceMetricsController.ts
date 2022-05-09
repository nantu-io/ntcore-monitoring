import { Request, Response } from 'express';
import { monitoringProvider } from '../libs/config/AppModule';
import { RequestValidator } from '../libs/utils/RequestValidator';
import { ErrorHandler } from '../libs/utils/ErrorHandler';

export class ServiceMetricsController {

    constructor() 
    {
        this.getLatency = this.getLatency.bind(this);
        this.getVolume = this.getVolume.bind(this);
    }

    /**
     * Endpoint to retrieve latency metrics.
     * @param req Request object.
     * @param res Response object.
     * Example: curl localhost:8180/dsp/api/v1/monitoring/{workspaceId}/metrics?name=metric&startTime=1650426680000&endTime=1650426682000
     */
    public async getLatency(
        req: Request<{workspaceId: string}, {}, {}, {startTime: number, endTime: number}>, 
        res: Response)
    {
        const { workspaceId } = req.params;
        const { startTime, endTime } = req.query;
        try {
            RequestValidator.validateRequest(workspaceId);
            const metrics = await monitoringProvider.query({workspaceId, startTime, endTime, name: "Latency", statistics: "average"});
            res.status(200).json({ metrics });
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }

    /**
     * Endpoint to retrieve traffic volumn.
     * @param req Request object.
     * @param res Response object.
     * Example: curl localhost:8180/dsp/api/v1/monitoring/{workspaceId}/metrics?name=metric&startTime=1650426680000&endTime=1650426682000
     */
     public async getVolume(
        req: Request<{workspaceId: string}, {}, {}, {startTime: number, endTime: number}>, 
        res: Response)
    {
        const { workspaceId } = req.params;
        const { startTime, endTime } = req.query;
        try {
            RequestValidator.validateRequest(workspaceId);
            const metrics = await monitoringProvider.query({workspaceId, startTime, endTime, name: "Latency", statistics: "count"});
            res.status(200).json({ metrics });
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }

    /**
     * Endpoint to retrieve traffic volumn.
     * @param req Request object.
     * @param res Response object.
     * Example: curl localhost:8180/dsp/api/v1/monitoring/{workspaceId}/metrics?name=metric&startTime=1650426680000&endTime=1650426682000
     */
     public async getErrorCount(
        req: Request<{workspaceId: string}, {}, {}, {startTime: number, endTime: number}>, 
        res: Response)
    {
        const { workspaceId } = req.params;
        const { startTime, endTime } = req.query;
        try {
            RequestValidator.validateRequest(workspaceId);
            const metrics = await monitoringProvider.query({workspaceId, startTime, endTime, name: "Error", statistics: "count"});
            res.status(200).json({ metrics });
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }
}
