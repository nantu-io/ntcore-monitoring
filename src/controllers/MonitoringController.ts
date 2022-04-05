import { Request, Response } from 'express';
import * as moment from 'moment';
import { monitoringProvider } from '../libs/config/AppModule';

export class MonitoringController {

    constructor() {
        this.writeTimeData = this.writeTimeData.bind(this);
        this.queryDataWithinRange = this.queryDataWithinRange.bind(this);
        this.uploadGroundTruth = this.uploadGroundTruth.bind(this);
    }

    public writeTimeData(req: Request, res: Response) {
        const id = req.params.id;
        const { value } = req.body;
        const timestamp = req.body.timestamp ?? moment().unix();
        const version = req.body.version ?? 1;

        return monitoringProvider.write(timestamp, id, version, value)
                .then(data => res.status(200).send('Success'))
                .catch(err => res.status(402).send({ error: err }));
    }

    public queryDataWithinRange(req: Request, res: Response) {
        const { id, from, to } = req.query;
        return monitoringProvider.readWithinRange(id, from, to)
                .then(data => res.status(200).send({ data }))
                .catch(err => res.status(402).send({ error: err }));
    }

    public uploadGroundTruth(req: Request, res: Response) {
        const workspaceId = req.params.workspaceId;
        const { ground_truth, input_data, timestamp } = req.body;
        return monitoringProvider.uploadGroundTruth(workspaceId, input_data, ground_truth, timestamp)
            .then(data => res.status(200).send({ data }))
            .catch(err => res.status(402).send({ error: err }));
    }
}
