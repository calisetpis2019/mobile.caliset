import Vue from 'nativescript-vue';
import * as http from "http";
import * as ApplicationSettings from "application-settings";
import { connectionType, getConnectionType } from 'tns-core-modules/connectivity';
import store from '~/store';

export async function sendLocationRecord(lat,lon,timeStamp){

    
    if (getConnectionType() === connectionType.none) {
    
        console.log("No hay conexión a Internet, se guarda la posición para posterior procesamiento...");
        store.state.pendingCoordinates.push({
            latitude: lat,
            longitude: lon,
            time: timeStamp,
        });
        console.log(timeStamp);
    }
    else {

        console.log("Se envía posición al servidor...");

        http.request({
            url: "http://" + store.state.ipAPI + ":21021/api/services/app/LocationRecords/Create",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+ store.state.session.token
            },
            content: JSON.stringify({
                        "latitude": lat,
                        "longitude": lon,
                        "when" : timeStamp,
            })
        }).then(response => {
            var result = response.content.toJSON().result;
            if (response.content.toJSON().success) {
                console.log("Se envió posición actual.");
            }
            else {
                console.log(response.content.toJSON().error.details);
                store.state.pendingCoordinates.push({
                    latitude: lat,
                    longitude: lon,
                    time: timeStamp,
                });

            }
        }, error => {
            console.error(error);
            store.state.pendingCoordinates.push({
                latitude: lat,
                longitude: lon,
                time: timeStamp,
            });
        });
    }
}

export async function sendPendings(){
	sendPendingCoordinates();
	sendPendingNotes();
}

export async function sendPendingCoordinates(){
    console.log("Enviando posiciones pendientes...");
    for(var i = 0; i < store.state.pendingCoordinates.length; i++){

        sendLocationRecord(store.state.pendingCoordinates[i].latitude,
                            store.state.pendingCoordinates[i].longitude,
                            store.state.pendingCoordinates[i].time);

        store.state.pendingCoordinates.splice(i,1);
    }
}

export async function sendPendingNotes(){
    console.log("Enviando comentarios pendientes...");
	for(var i = 0; i < store.state.pendingNotes.length; i++){

		await http.request({
            url: "http://" + store.state.ipAPI + ":21021/api/services/app/Comments/Create",
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization":"Bearer "+ store.state.session.token                       
            },
            content: JSON.stringify({
                "commentary": store.state.pendingNotes[i].comment,
                "operationId": store.state.pendingNotes[i].operationId,
            })
        }).then(response => {
            var result = response.content.toJSON().result;
            if (response.content.toJSON().success) {
                console.log("Comentario agregado con éxito.");
                store.state.pendingNotes.splice(i,1);
            }
            else {
                console.log("Ocurrió un error al agregar el comentario.")
            }
        }, error => {
            console.error(error);
        });

    }

}