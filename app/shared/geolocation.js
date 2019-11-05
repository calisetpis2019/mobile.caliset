import Vue from 'nativescript-vue';
import * as ApplicationSettings from "application-settings";
import { connectionType, getConnectionType } from 'tns-core-modules/connectivity';
import store from '~/store';
import { sendLocationRecord } from './communication'


const geolocation = require("nativescript-geolocation");
const { Accuracy } = require("tns-core-modules/ui/enums");

export async function  getLocation() {

    var lat = null;
    var lon = null;
    var time = null;

    console.log("Inicia función getLocation");
    console.log(store.state.ipAPI);
    
    await geolocation
        .getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            maximumAge: 5000,
            timeout: 20000
        })
        .then(res => {

            console.log(res);

            lat = res.latitude;
            lon = res.longitude;
            time = res.timestamp;

            console.log("respuesta:");
            console.log(res.latitude);
            console.log(res.longitude);
            console.log(res.time);

        }).catch(e => {
            console.log("error al obtener la localización: " + e);
        });

    sendLocationRecord(lat,lon,time);

}