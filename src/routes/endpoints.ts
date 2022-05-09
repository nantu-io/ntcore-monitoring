import * as express from "express";
import { BaseMetricsController } from "../controllers/BaseMetricsController";
import { PerformanceMetricsController } from "../controllers/PerformanceMetricsController";

export class Routes
{
    private baseMetricsController: BaseMetricsController;
    private performanceMetricsController: PerformanceMetricsController;

    constructor() 
    {
        this.baseMetricsController = new BaseMetricsController();
        this.performanceMetricsController = new PerformanceMetricsController();
    }

    public routes(app: express.Application): void 
    {
        app.route('/dsp/api/v1/monitoring/metrics')
            .post(this.baseMetricsController.writeTimeSeries);
        app.route('/dsp/api/v1/monitoring/performances')
            .post(this.performanceMetricsController.uploadGroundTruth)
        app.route('/dsp/api/v1/monitoring/:workspaceId/metrics')
            .get(this.baseMetricsController.queryTimeSeries);
    }
}
