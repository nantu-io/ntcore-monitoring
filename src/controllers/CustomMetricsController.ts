import { Request, Response } from 'express';
import { custommetricsProvider } from "../libs/config/AppModule";
import { CustomMetrics } from '../providers/monitoring/custommetrics/CustomMetricsProvider';
import { RequestValidator } from '../libs/utils/RequestValidator';
import { ErrorHandler } from '../libs/utils/ErrorHandler';

export class CustomMetricsController 
{
    public constructor()
    {
        this.createCustomMetrics = this.createCustomMetrics.bind(this);
        this.readCustomMetrics = this.readCustomMetrics.bind(this);
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
     public async createCustomMetrics(req: Request<{}, {}, CustomMetrics, {}>, res: Response) 
     {
         try {
             const {  workspaceId, name, type, formula } = req.body;
             const timestamp = req.body.timestamp ?? Date.now();
             RequestValidator.validateRequest(workspaceId, name, type, formula);
             await custommetricsProvider.create({workspaceId, name, type, timestamp, formula});
             res.status(201).json({workspaceId, name, type, timestamp, formula});
         } catch (err) {
             ErrorHandler.handleException(err, res);
         }
     }

    
    public async readCustomMetrics(
    req: Request<{workspaceId: string}, {}, {}, {}>, 
    res: Response<CustomMetrics>){
        try {
            const { workspaceId } = req.params;
            RequestValidator.validateRequest(workspaceId);
            const custom_metrics = await custommetricsProvider.read(workspaceId)
            res.status(200).send(custom_metrics)
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }
}