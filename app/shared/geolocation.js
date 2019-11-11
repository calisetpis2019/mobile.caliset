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
    
    if (store.state.operations.length != 0) {

        await geolocation
            .getCurrentLocation({
                desiredAccuracy: Accuracy.high,
                maximumAge: 5000,
                timeout: 20000
            })
            .then(res => {

                lat = res.latitude;
                lon = res.longitude;
                var uyt = new Date();
                time = new Date (Date.UTC(uyt.getFullYear(), uyt.getMonth(), uyt.getDate(),uyt.getHours(), 
                                    uyt.getMinutes(), uyt.getSeconds()));
                sendLocationRecord(lat,lon,time);
            }).catch(e => {
                console.log("Error al obtener la localización: " + e);
            });
        }

}