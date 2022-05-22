import * as express from "express";
import { BaseMetricsController } from "../controllers/BaseMetricsController";
import { PerformanceMetricsController } from "../controllers/PerformanceMetricsController";
import { LogEventsController } from "../controllers/LogEventsController";

export class Routes
{
    private baseMetricsController: BaseMetricsController;
    private performanceMetricsController: PerformanceMetricsController;
    private logEventsController: LogEventsController;

    constructor() 
    {
        this.baseMetricsController = new BaseMetricsController();
        this.performanceMetricsController = new PerformanceMetricsController();
        this.logEventsController = new LogEventsController();
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
    }
}
