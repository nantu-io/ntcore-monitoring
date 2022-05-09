import { Request, Response } from 'express';
import { monitoringProvider } from '../libs/config/AppModule';
import { GroundTruthUploadContext } from '../providers/monitoring/MonitoringProvider';
import { RequestValidator } from '../libs/utils/RequestValidator';
import { ErrorHandler } from '../libs/utils/ErrorHandler';

export class PerformanceMetricsController {

    constructor() 
    {
        this.uploadGroundTruth = this.uploadGroundTruth.bind(this);
    }

    /**
     * Endpoint to ingest timeseries data.
     * @param req Request object.
     * @param res Response object.
     * Example: curl -X POST \
     *      -H "Content-Type: application/json" \
     *      -d '{"workspaceId": "C123", "inputData": "1", "groundTruth": "2","timestamp": 1650426681000}' \
     *      localhost:8180/dsp/api/v1/monitoring/performances
     */
    public async uploadGroundTruth(
        req: Request<{}, {}, GroundTruthUploadContext, {}>, 
        res: Response)
    {
        const { workspaceId, inputData, groundTruth } = req.body;
        try {
            RequestValidator.validateRequest(workspaceId, inputData, groundTruth);
            const timestamp = req.body.timestamp ?? Date.now();
            await monitoringProvider.uploadGroundTruth(req.body)
            res.status(200).json({ workspaceId, inputData, groundTruth, timestamp });
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }
}
