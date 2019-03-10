
'use strict';
const functions = require('firebase-functions');
const BigQuery = require("@google-cloud/bigquery")


exports = module.exports = functions.firestore
  .document("/productor/{id}")
  .onDelete((snap, context) => {
    console.log(`nuevo evento delete para documento productor ID: ${context.params.id}`)
    const sqlQuery = `DELETE FROM rumeca.productor WHERE id="${context.params.id}";`;
  
    const bigquery = new BigQuery();
    const options = {
      query: sqlQuery,
      timeoutMs: 100000, // Time out after 100 seconds.
      useLegacySql: false, // Use standard SQL syntax for queries.
    };
  
    // Runs the query
    return bigquery.query(options).catch(err => {
        console.error(`table.delete: ${JSON.stringify(err)}`)
        return err
      })
  })




