import * as express from "express";
import { MonitoringController } from "../controllers/MonitoringController";

export class Routes
{
    private monitoringController: MonitoringController;

    constructor() 
    {
        this.monitoringController = new MonitoringController();
    }

    public routes(app: express.Application): void 
    {
        app.route('/dsp/api/v1/monitoring/metrics')
            .post(this.monitoringController.writeTimeSeries);
        app.route('/dsp/api/v1/monitoring/:workspaceId/metrics')
            .get(this.monitoringController.queryTimeSeries);
        app.route('/dsp/api/v1/monitoring/performances')
            .post(this.monitoringController.uploadGroundTruth)
    }
}
