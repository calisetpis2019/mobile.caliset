import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as http from "http";
import * as ApplicationSettings from "application-settings";

Vue.use(Vuex);

var firebase = require("nativescript-plugin-firebase");

const store = new Vuex.Store({
    state: {
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
            console.log("userId en el store");
            console.log(data.userId);
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
        },

        operations(state,data) {
            console.log("Store: Guardo las operaciones del usuario en el store");
            state.operations = data.operations;
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

        }
    }
});

Vue.prototype.$store = store;

export default store
