import * as express from "express";
import { BaseMetricsController } from "../controllers/BaseMetricsController";
import { PerformanceMetricsController } from "../controllers/PerformanceMetricsController";
import { ServiceMetricsController } from "../controllers/ServiceMetricsController";

export class Routes
{
    private baseMetricsController: BaseMetricsController;
    private performanceMetricsController: PerformanceMetricsController;
    private serviceMetricsController: ServiceMetricsController;

    constructor() 
    {
        this.baseMetricsController = new BaseMetricsController();
        this.performanceMetricsController = new PerformanceMetricsController();
        this.serviceMetricsController = new ServiceMetricsController();
    }

    public routes(app: express.Application): void 
    {
        app.route('/dsp/api/v1/monitoring/metrics')
            .post(this.baseMetricsController.writeTimeSeries);
        app.route('/dsp/api/v1/monitoring/performances')
            .post(this.performanceMetricsController.uploadGroundTruth)
        app.route('/dsp/api/v1/monitoring/:workspaceId/metrics')
            .get(this.baseMetricsController.queryTimeSeries);
        app.route('/dsp/api/v1/monitoring/:workspaceId/latency')
            .get(this.serviceMetricsController.getLatency)
        app.route('/dsp/api/v1/monitoring/:workspaceId/errorCount')
            .get(this.serviceMetricsController.getErrorCount)
        app.route('/dsp/api/v1/monitoring/:workspaceId/volume')
            .get(this.serviceMetricsController.getVolume)
    }
}
