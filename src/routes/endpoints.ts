import * as express from "express";
import { BaseMetricsController } from "../controllers/BaseMetricsController";
import { PerformanceMetricsController } from "../controllers/PerformanceMetricsController";
import { LogEventsController } from "../controllers/LogEventsController";
import { CustomMetricsController } from "../controllers/CustomMetricsController";

export class Routes
{
    private baseMetricsController: BaseMetricsController;
    private performanceMetricsController: PerformanceMetricsController;
    private logEventsController: LogEventsController;
    private customMetricsController: CustomMetricsController;

    constructor() 
    {
        this.baseMetricsController = new BaseMetricsController();
        this.performanceMetricsController = new PerformanceMetricsController();
        this.logEventsController = new LogEventsController();
        this.customMetricsController = new CustomMetricsController();
    }

    public routes(app: express.Application): void 
    {
        app.route('/dsp/api/v1/monitoring/metrics')
            .post(this.baseMetricsController.writeTimeSeries);
        app.route('/dsp/api/v1/monitoring/:workspaceId/metrics')
            .post(this.baseMetricsController.writeTimeSeries);
        app.route('/dsp/api/v1/monitoring/:workspaceId/performances')
            .post(this.performanceMetricsController.uploadGroundTruth)
        app.route('/dsp/api/v1/monitoring/:workspaceId/metrics')
            .get(this.baseMetricsController.queryTimeSeries);
        app.route('/dsp/api/v1/monitoring/:workspaceId/events')
            .post(this.logEventsController.writeLogEvents)
            .get(this.logEventsController.queryLogEvents)
        app.route('/dsp/api/v1/monitoring/:workspaceId/custommetrics')
            .post(this.customMetricsController.createCustomMetrics);
        app.route('/dsp/api/v1/monitoring/:workspaceId/custommetrics')
            .get(this.customMetricsController.readCustomMetrics);
    }
}
