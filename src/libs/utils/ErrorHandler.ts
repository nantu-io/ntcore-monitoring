import { Response } from 'express';
import { IllegalArgumentException, NotFoundException } from '../../commons/Errors';

export class ErrorHandler
{
    public static handleException(err: Error, res: Response)
    {
        if (err instanceof IllegalArgumentException) {
            res.status(400).json({error: `Invalid input parameters. ${err}`});
        } else if (err instanceof NotFoundException) {
            res.status(404).json({error: `Not found exception. ${err}`});
        } else {
            res.status(500).json({error: `Unable process request. ${err}`});
        }
    }
}