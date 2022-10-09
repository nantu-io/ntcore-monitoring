/**
 * Query to verify if the custom metrics table exists.
 */
 export const CUSTOMMETRICS_EXISTENCE = `SELECT name FROM sqlite_master WHERE type='table' and name='custommetrics';`
 /**
  * Query to insert the new custom metrics.
  */
 export const CUSTOMMETRICS_CREATE = `INSERT INTO custommetrics (workspaceId, name, type, timestamp, formula) VALUES ($workspaceId, $name, $type, $timestamp, $formula)`
 /**
  * Query to retrieve custom metrics with the given id.
  */
 export const CUSTOMMETRICS_READ = `SELECT workspaceId, name, type, timestamp, formula FROM custommetrics WHERE workspaceId=$workspaceId`
 /**
  * Query to create the custom metrics table.
  */
 export const CUSTOMMETRICS_INITIALIZATION = `
     CREATE TABLE IF NOT EXISTS custommetrics (
         workspaceId    TEXT PRIMARY KEY,
         name           TEXT,
         type           TEXT,
         timestamp      INTEGER,
         formula        TEXT
     );
 `