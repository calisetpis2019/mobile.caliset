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
            var uyt = new Date();
            time = new Date (Date.UTC(uyt.getFullYear(), uyt.getMonth(), uyt.getDate(),uyt.getHours(), 
                                uyt.getMinutes(), uyt.getSeconds()));

        }).catch(e => {
            console.log("error al obtener la localización: " + e);
        });

    sendLocationRecord(lat,lon,time);

}