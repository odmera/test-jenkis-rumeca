
'use strict';
const functions = require('firebase-functions');
const BigQuery = require("@google-cloud/bigquery")


/**
 * permite enviar un producto de firestore a bigquery
 */
exports = module.exports = functions.firestore
  .document("/productoproductor/{id}")
  .onCreate((snap, context) => {
    console.log(`nuevo evento crear para documento productoproductor ID: ${context.params.id}`)
    let datasetName = "rumeca"
    let tableName = "productoproductor"
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
        idUsuarioProductor : document.idUsuarioProductor,
        nombreCompletoProductor : document.nombreCompletoProductor,
        codigodepartamento : document.codigodepartamento,
        nombredepartamento : document.nombredepartamento,
        codigomunicipio    : document.codigomunicipio,
        nombremunicipio    : document.nombremunicipio,
        codigovereda       : document.codigovereda,
        nombrevereda       : document.nombrevereda,
        codigoCategoria    : document.codigoCategoria,
        nombreCategoria    : document.nombreCategoria,
        codigoProducto     : document.codigoProducto,
        nombreProducto     : document.nombreProducto,
        cantidadDisponible : document.cantidadDisponible,
        unidad             : document.unidad,
        fechaSiembra       : document.fechaSiembra,
        fechaCosecha       : document.fechaCosecha,
        telefono           : document.telefono,
        valorSugerido      : document.valorSugerido,
        valorVenta         : document.valorVenta,
        nombrePlaza        : document.nombrePlaza,
        fotos              : document.fotos != null &&  document.fotos.length > 0 ?  document.fotos[0].file_url : null,
        fechaRegistro      : document.fechaRegistro
       }
     };
     

    return table.insert(row, { raw: true }).catch(err => {
      console.error(`table.insert: ${JSON.stringify(err)}`)
      return err
    })
  })


