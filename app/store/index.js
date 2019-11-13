import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as http from "http";
import * as ApplicationSettings from "application-settings";
import {getLocation} from "~/shared/geolocation";
import {sendPendings} from "~/shared/communication";

Vue.use(Vuex);

var firebase = require("nativescript-plugin-firebase");

const store = new Vuex.Store({
    state: {
        gpsInterval : 60*1000, //segundos * 1000
        pendingInterval : 60*1000,
        session : {
            userId: "",
            email: "",
            password: "",
            token: "",
            firstLogin: false,
            date: {
                year: "",
                month: "",
                day: ""
            },
            deviceToken: {
                token: "",
                updated: true
            }
        },
        ipAPI : "",
        loggedIn: false,
        activeOperations: [],
        operations: [],
        newOperations: [],
        futureOperations: [],
        finishedOperations: [],
        hourRecords: [],
        timerId : null,
        coordinatesId: 0,
        assignations: [],
        pendingCoordinates : [],
        pendingNotes: [],
        timerPendings: null,

    },

    mutations: {

        load(state) {
            if(ApplicationSettings.getString("store")) {
                this.replaceState(
                    Object.assign(state, JSON.parse(ApplicationSettings.getString("store")))
                );
            }
            // Acá se modifica la ip para que al cargar el store anterior no se pise la ip que queremos usar actualmente
            state.ipAPI = "192.168.1.2";
        },

        login(state, data) {
            state.session.userId = data.userId;
            state.session.email = data.email;
            state.session.password = data.password;
            state.session.token = data.token;
            state.session.firstLogin = data.firstLogin;
            if (data.firstLogin) {
                console.log("store -> mutation -> login(): firstlogin");
                state.loggedIn = false;
            }
            else {
                console.log("store -> mutation -> login(): not firstlogin");
                state.loggedIn = true;
                // Se guarda el día para controlar que al año se cierre sesión
                var d = new Date();
                state.session.date.year = d.getFullYear();
                // Se suma 1 porque da valores entre 0 y 11
                state.session.date.month = d.getMonth() + 1;
                state.session.date.day = d.getDate();
            }
            http.request({
                url: "http://" + state.ipAPI + ":21021/api/services/app/User/SetLastLoginTime",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":"Bearer "+ state.session.token
                }
            }).then(response => {
                var result = response.content.toJSON().result;
                if (response.content.toJSON().success) {
                    console.log("Se actualizó lastLoginTime.");
                    console.log(result);
                }
                else {
                    console.log("Hubo un problema al actualizar lastLoginTime.");
                }
            }, error => {
                console.error(error);
            });

            firebase.registerForPushNotifications();

            //Ejecuta getLocation cada intervalo de tiempo
            state.timerId = setInterval(function(){getLocation()},state.gpsInterval);

            //Ejecuta sendPendings cada intervalo de tiempo
            state.timerPendings = setInterval(function(){sendPendings()},state.pendingInterval);
        },

        refreshOperationNotes(state,data){
            state.selectedOperation.comments = data.comments;
        },

        saveNote(state,data){
            state.pendingNotes.push(data);
        },

        savePositions(state,data){
            state.pendingCoordinates.push(data);
        },

        activeOps(state,data) {
            state.operations = data.operations;
        },

        newOps(state,data) {
            state.newOperations = data.newOperations;
        },

        futureOps(state,data) {
            state.futureOperations = data.futureOperations;
        },

        activeOperations(state,data) {
            state.activeOperations = data.operations;
        },

        finishedOperations(state,data) {
            state.finishedOperations = data.operations;
        },

        hourRecords(state,data) {
            state.hourRecords = data.hours;
        },

        selectedComment(state,data){
            console.log("Store: Guardo el comentario seleccionado");
            state.selectedComment = data.selectedComment;
        },

        selectedOperation(state,data) {
            console.log("Store: Guardo la operación seleccionada");
            state.selectedOperation = data.selectedOperation;
        },

        selectedNewOperation(state,data) {
            console.log("Store: Guardo la operación seleccionada");
            state.selectedNewOperation = data.selectedNewOperation;
        },

        selectedHourRecord(state,data) {
            console.log("Store: Guardo el registro de horas seleccionado");
            state.selectedHourRecord = data.selectedHourRecord;
        },

        logout(state) {
            firebase.unregisterForPushNotifications();
            state.session.userId = "";
            state.session.email = "";
            state.session.password = "";
            state.session.token = "";
            state.session.firstLogin = false;
            state.session.date.year = "";
            state.session.date.year = "";
            state.session.date.year = "";
            state.loggedIn = false;
            clearInterval(state.timerId);
            clearInterval(state.timerPendings);
        },

        saveDeviceToken(state, data){
            state.session.deviceToken.token = data.token;
            state.session.deviceToken.updated = true;
            if (state.session.token != ""){
                http.request({
                    url: "http://" + state.ipAPI + ":21021/api/services/app/UserDeviceToken/AddDeviceToken?input=" + state.session.deviceToken.token,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ state.session.token
                    }
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (response.content.toJSON().success) {
                        console.log("Se envió device token con éxito.");
                        console.log(result);
                        state.session.deviceToken.updated = false;
                    }
                    else {
                        console.log("Hubo un problema al enviar el device token.");
                    }
                }, error => {
                    console.error(error);
                });
            }

        },

        startGPS(state){
            state.timerId = setInterval(function(){getLocation()},state.gpsInterval);
        },

        startSendingPendings(state){
            state.timerPendings = setInterval(function(){sendPendings()},state.pendingInterval);
        },
        

    }
});

Vue.prototype.$store = store;

export default store
