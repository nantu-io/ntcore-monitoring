export const WRITE_LINE = `INSERT INTO metrics (time, workspace_id, version, value) VALUES ($1, $2, $3, $4);`;

export const CREATE_TABLE = `
    CREATE TABLE IF NOT EXISTS metrics (
        time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        workspace_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        value FLOAT NOT NULL
    );`;

export const CREATE_COMPARISON_TABLE = `
    CREATE TABLE IF NOT EXISTS compare_metrics (
        time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        workspace_id VARCHAR NOT NULL,
        version INTEGER NOT NULL,
        input_data VARCHAR NOT NULL,
        ground_truth VARCHAR NOT NULL,
        prediction VARCHAR NOT NULL
    )
`;

export const WRITE_LINE_COMPARISON_TABLE = `
    INSERT INTO compare_metrics (time, workspace_id, version, input_data, ground_truth, prediction) 
    VALUES ($1, $2, $3, $4, $5, $6);
`;

export const RANGE_QUERY = `SELECT * FROM metrics WHERE time > $1 AND time < $2 AND workspace_id = $3;`;

export const CREATE_HYPERTABLE = `SELECT create_hypertable('metrics', 'time', if_not_exists => TRUE);`;

export const CREATE_COMPARISON_HYPERTABLE = `SELECT create_hypertable('compare_metrics', 'time', if_not_exists => TRUE)`;
