
'use strict';
const functions = require('firebase-functions');
const NodeGeocoder = require('node-geocoder');
const BigQuery = require("@google-cloud/bigquery")
const admin = require('firebase-admin');

try { admin.initializeApp() } catch (e) { console.log(e) }

/**
 * metodo que permite establecer latitud, logitud y fecha de registro para 
 * las tiendas que se suben por medio de un archivo plano, y luego envia la 
 * tiendas a bigquery
 */
exports = module.exports = functions.firestore
    .document('establecimiento/{id}')
    .onCreate( async (snap, context) => {
    const document = snap.data();
    document['id'] = context.params.id

    if(document.latitud == null || document.longitud == null){
        let direccion =`${document.direccion},${document.nombremunicipio},${document.nombredepartamento}`
        var options = {
            provider: 'google',
            language:'es',
            httpAdapter: 'https',
            apiKey: 'AIzaSyC8rYgI8ofmF7Iv3EBT2DOL9yw3FoaBcwA',
            formatter: null 
        };
        var geocoder = NodeGeocoder(options);
        let res = await geocoder.geocode({address: direccion, countryCode: 'CO'});
        if(res != undefined && res != null && res.length > 0){
           let item = res[0];
           document.latitud = item.latitude;
           document.longitud = item.longitude;
        }
        else{ //pone colombia por defecto
            document.latitud = -72.0000000;
            document.longitud = 4.0000000;
        }
        //fecha actual
        let fechaRegistro = new Date().getTime();
        document['fechaRegistro'] = fechaRegistro;
        //console.log(document.fechaRegistro);

        var docEstablecimiento = admin.firestore().collection('establecimiento').doc(context.params.id);
        let resUpdate = await docEstablecimiento.update(document);
        //console.log("resUpdate " , resUpdate);
    } 

    ///se envia el regstro a bigQuery 
    let datasetName = "rumeca"
    let tableName = "establecimiento"
    let bigquery = new BigQuery()

    let dataset = bigquery.dataset(datasetName);

    let table = dataset.table(tableName);
    table.exists().catch(err => {
      console.error(`table.exists: tabla ${tableName} no existe: ${JSON.stringify(err)}` )
      return err
    })

    let row = {
      insertId: context.params.id,
      json: {
        id:context.params.id,
        idUsuario: document.idUsuario,
        nombreCompleto: document.nombreCompleto,
        correo: document.correo,
        tipoEstablecimiento: document.tipoEstablecimiento,
        codigodepartamento: document.codigodepartamento,
        nombredepartamento: document.nombredepartamento,
        codigomunicipio: document.codigomunicipio,
        nombremunicipio: document.nombremunicipio,
        direccion: document.direccion,
        telefono: document.telefono,
        latitud: document.latitud,
        longitud: document.longitud,
        habilitado: document.habilitado,
        fechaRegistro: document.fechaRegistro,
        esAlerta:document.esAlerta,
        productos:null
       }
    };

    return table.insert(row, { raw: true }).catch(err => {
      console.error(`table.insert.error: ${JSON.stringify(err)}`)
      return err
    }).then(res => {
        console.log(`table.insert.ok: ${JSON.stringify(res)}`)
   
    })
});






