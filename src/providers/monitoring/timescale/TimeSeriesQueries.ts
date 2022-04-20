/**
 * Defines the schema for the metrics table.
 */
export const METRICS_INITIALIZATION = `
    CREATE TABLE IF NOT EXISTS metrics (
        workspace_id TEXT NOT NULL,
        name VARCHAR NOT NULL,
        value FLOAT NOT NULL,
        timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        PRIMARY KEY(workspace_id, name, timestamp)
    );`;
/**
 * Hypertable for metrics.
 */
export const METRICS_HYPERTABLE_INITIALIZATION = `SELECT create_hypertable('metrics', 'timestamp', if_not_exists => TRUE);`;
/**
 * Defines the schema for performances table.
 */
export const PERFORMANCES_INITIALIZATION = `
    CREATE TABLE IF NOT EXISTS performances (
        workspace_id VARCHAR NOT NULL,
        input_data VARCHAR NOT NULL,
        ground_truth VARCHAR NOT NULL,
        prediction VARCHAR NOT NULL,
        timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL
    )`;
/**
 * Hypertable for performances.
 */
export const PERFORMANCES_HYPERTABLE_INITIALIZATION = `SELECT create_hypertable('performances', 'timestamp', if_not_exists => TRUE)`;
/**
 * Query to create metric line.
 */
export const METRIC_CREATE = `
    INSERT INTO metrics (workspace_id, name, value, timestamp) 
    VALUES ($1, $2, $3, $4);`;
/**
 * Query to read metric lines with all time.
 */
export const METRIC_READ_WITHOUT_RANGE = `
    SELECT name, value, timestamp
    FROM metrics 
    WHERE workspace_id = $1 AND name = $2
    ORDER BY timestamp`;
/**
 * Query to read metric lines with start time.
 */
export const METRIC_READ_WITH_START_TIME = `
    SELECT name, value, timestamp
    FROM metrics 
    WHERE workspace_id = $1 AND name = $2 AND timestamp >= $3
    ORDER BY timestamp;`;
/**
 * Query to read metric lines with end time.
 */
export const METRIC_READ_WITH_END_TIME = `
    SELECT name, value, timestamp
    FROM metrics 
    WHERE workspace_id = $1 AND name = $2 AND timestamp < $3
    ORDER BY timestamp;`;
/**
 * Query to read metric lines with specific range.
 */
export const METRIC_READ_WITH_RANGE = `
    SELECT name, value, timestamp
    FROM metrics 
    WHERE workspace_id = $1 AND name = $2 AND timestamp >= $3 AND timestamp < $4
    ORDER BY timestamp;`;
/**
 * Query to create performance line.
 */
export const PERFORMANCE_CREATE = `
    INSERT INTO performances (workspace_id, input_data, ground_truth, prediction, timestamp) 
    VALUES ($1, $2, $3, $4, $5);`;