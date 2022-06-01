import { Request, Response } from 'express';
import { logEventsProvider } from '../libs/config/AppModule';
import { RequestValidator } from '../libs/utils/RequestValidator';
import { ErrorHandler } from '../libs/utils/ErrorHandler';
import { LogEvent } from '../providers/monitoring/LogEventsProvider';

export class LogEventsController {

    constructor() 
    {
        this.writeLogEvents = this.writeLogEvents.bind(this);
        this.queryLogEvents = this.queryLogEvents.bind(this);
    }

    /**
     * Endpoint to ingest timeseries data.
     * @param req Request object.
     * @param res Response object.
     * Example: curl -X POST -H "Content-Type: application/json" -d '{"event": {"message": "ntcore log events test"}}' localhost:8180/dsp/api/v1/monitoring/{workspace_id}/events
     */
    public async writeLogEvents(
        req: Request<{workspaceId: string}, {}, {event: LogEvent}, {}>, 
        res: Response<{event: LogEvent}>) : Promise<void>
    {
        const { workspaceId } = req.params;
        const { event } = req.body;
        try {
            RequestValidator.validateRequest(workspaceId, event);
            await logEventsProvider.putEvents(workspaceId, event);
            res.status(201).json({ event });
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }

    /**
     * Endpoint to ingest timeseries data.
     * @param req Request object.
     * @param res Response object.
     * Example: curl 'localhost:8180/dsp/api/v1/monitoring/{workspaceId}/events?queryPattern="ntcore log"'
     */
    public async queryLogEvents(
        req: Request<{workspaceId: string}, {}, {}, {startTime: number, endTime: number, queryPattern: string, nextToken: string}>, 
        res: Response<{workspaceId: string, events: LogEvent[], nextToken: string}>) : Promise<void>
    {
        const { workspaceId } = req.params;
        const { startTime, endTime, queryPattern, nextToken } = req.query;
        try {
            RequestValidator.validateRequest(workspaceId);
            const result = await logEventsProvider.getEvents({workspaceId, startTime, endTime, queryPattern, nextToken});
            res.status(200).json({ workspaceId, events: result.events, nextToken: result.nextToken });
        } catch (err) {
            ErrorHandler.handleException(err, res);
        }
    }
}
