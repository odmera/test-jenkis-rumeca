
'use strict';
const functions = require('firebase-functions');
const BigQuery = require("@google-cloud/bigquery")


/**
 * permite enviar un producto de firestore a bigquery
 */
exports = module.exports = functions.firestore
  .document("/productor/{id}")
  .onCreate((snap, context) => {
    console.log(`nuevo evento crear para documento productor ID: ${context.params.id}`)
    let datasetName = "rumeca"
    let tableName = "productor"
    let bigquery = new BigQuery()

    let dataset = bigquery.dataset(datasetName);

    let table = dataset.table(tableName);
    table.exists().catch(err => {
      console.error(`table.exists: tabla ${tableName} no existe: ${JSON.stringify(err)}` )
      return err
    })

    let document = snap.data();
    let row = {
      insertId: context.params.id,
      json: {
        id:context.params.id,
        idUsuario          : document.idUsuario,
        nombreCompleto     : document.nombreCompleto,
        correo             : document.correo,
        cedula             : document.cedula,
        telefono           : document.telefono,
        codigoPlaza        : document.codigoPlaza,
        nombrePlaza        : document.nombrePlaza,
        codigodepartamento : document.codigodepartamento,
        nombredepartamento : document.nombredepartamento,
        codigomunicipio    : document.codigomunicipio,
        nombremunicipio    : document.nombremunicipio,
        codigovereda       : document.codigovereda,
        nombrevereda       : document.nombrevereda,
        habilitado         : true
       }
     };
     

    return table.insert(row, { raw: true }).catch(err => {
      console.error(`table.insert: ${JSON.stringify(err)}`)
      return err
    })
  })




