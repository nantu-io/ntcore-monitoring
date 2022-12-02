import { Request, Response } from 'express';
import { customMetricsProvider } from "../libs/config/AppModule";
import { CustomMetrics } from '../providers/monitoring/custommetrics/CustomMetricsProvider';
import { RequestValidator } from '../libs/utils/RequestValidator';
import { ErrorHandler } from '../libs/utils/ErrorHandler';

export class CustomMetricsController 
{
    public constructor()
    {
        this.createCustomMetrics = this.createCustomMetrics.bind(this);
        this.readCustomMetrics = this.readCustomMetrics.bind(this);
        this.listCustomMetrics = this.listCustomMetrics.bind(this);
    }

    /**
     * Endpoint to create custom metrics.
     * @param req Request object.
     * @param res Response object.
     * Example: curl -X POST -H 'Content-Type: application/json' -d '{"name": "test", "type": "request", "formula": "lambda x: x"}' http://localhost:8180/dsp/api/v1/monitoring/{workspaceId}/customMetrics
     */
    public async createCustomMetrics(
        req: Request<{workspaceId: string}, {}, {name: string, type: "request" | "response", timestamp: number, formula: string}, {}>,
        res: Response<CustomMetrics>) 
    {
        try {
            const { workspaceId } = req.params;
            const { name, type, formula } = req.body;
            const timestamp = req.body.timestamp ?? Date.now();
            RequestValidator.validateRequest(workspaceId, name, type, formula);
            await customMetricsProvider.create({workspaceId, name, type, timestamp, formula});
            res.status(201).json({workspaceId, name, type, timestamp, formula});
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }

    /**
     * Endpoint to read custom metrics.
     * @param req Request object.
     * @param res Response object.
     * Example: curl http://localhost:8180/dsp/api/v1/monitoring/{workspaceId}/customMetrics/test
     */
    public async readCustomMetrics(
        req: Request<{workspaceId: string, name: string}, {}, {}, {}>, 
        res: Response<CustomMetrics>)
    {
        try {
            const { workspaceId, name } = req.params;
            RequestValidator.validateRequest(workspaceId, name);
            const customMetrics = await customMetricsProvider.read(workspaceId, name);
            res.status(200).send(customMetrics);
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }

    /**
     * Endpoint to read custom metrics.
     * @param req Request object.
     * @param res Response object.
     * Example: curl http://localhost:8180/dsp/api/v1/monitoring/{workspaceId}/customMetrics
     */
     public async listCustomMetrics(
        req: Request<{workspaceId: string}, {}, {}, {}>, 
        res: Response<CustomMetrics[]>)
    {
        try {
            const { workspaceId } = req.params;
            RequestValidator.validateRequest(workspaceId);
            const customMetrics = await customMetricsProvider.list(workspaceId);
            res.status(200).send(customMetrics);
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }
}