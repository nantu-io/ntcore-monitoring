import {
    WRITE_LINE, 
    CREATE_TABLE, 
    CREATE_HYPERTABLE, 
    RANGE_QUERY,
    CREATE_COMPARISON_HYPERTABLE,
    CREATE_COMPARISON_TABLE,
    WRITE_LINE_COMPARISON_TABLE
} from "./BasicQueries";
import { unixTimestampToPostgresFormat } from '../../helpers/PostgresHelper';
import { GenericMonitoringProvider } from './GenericMonitoringProvider';
import { deploymentProvider } from "../../libs/config/AppModule";
import { InvalidStateException } from "../../commons/Errors";
import axios from 'axios';
import { PredictObj } from "./RPCTypes";
import * as moment from 'moment';
import { Pool } from "pg";


export default class TimescaleProvider implements GenericMonitoringProvider {
    private _pool: Pool;

    constructor(pool: Pool) {
        this._pool = pool;
    }

    public async initialize() {
        await this._pool.query(CREATE_TABLE, async (err, res) => {
            await this._pool.query(CREATE_HYPERTABLE);
        });
        await this._pool.query(CREATE_COMPARISON_TABLE, async (err, res) => {
            await this._pool.query(CREATE_COMPARISON_HYPERTABLE);
        });
        console.log('Initialized app monitor');
    }

    public async write(timestamp, id, version, value) {
        const time = unixTimestampToPostgresFormat(timestamp);
        console.log(`${time}, ${id}, ${version}, ${value}`)
        await this._pool.query(WRITE_LINE, [time, id, version, value]);
    }

    public async readWithinRange(id, from, to) {
        const start = unixTimestampToPostgresFormat(from);
        const end = unixTimestampToPostgresFormat(to);
        const result = await this._pool.query(RANGE_QUERY, [start, end, id]);
        return result.rows;
    }

    public async uploadGroundTruth(workspaceId, inputData, groundTruth, timestamp) {
        const latestVersion = await deploymentProvider.findLatestDeployedVersion(workspaceId);
        if (latestVersion === undefined) throw new InvalidStateException(`No active deployment found associated with workspace id ${workspaceId}`);

        // TODO: Change endpoint
        await axios.post<PredictObj>(`http://localhost:5000/predict`)
            .then(async (res) => {
                const time = timestamp ?? moment().unix();
                const value = res.data.value;
                await this._pool.query(WRITE_LINE_COMPARISON_TABLE, [time, workspaceId, latestVersion, inputData, groundTruth, value]);
            }).catch((err) => {
                throw err;
            });
    }
}
