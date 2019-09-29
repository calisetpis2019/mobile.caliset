import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as ApplicationSettings from "application-settings";

Vue.use(Vuex);

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
        },

        operations(state,data) {
            console.log("Store: Guardo las operaciones del usuario en el store");
            state.operations = data.operations;
        },

        selectedOperation(state,data) {
            console.log("Store: Guardo la operación seleccionada");
            state.selectedOperation = data.selectedOperation;
        },

        logout(state) {
            state.session.userId = "";
            state.session.email = "";
            state.session.password = "";
            state.session.token = "";
            state.session.firstLogin = false;
            state.session.date.year = "";
            state.session.date.year = "";
            state.session.date.year = "";
            state.loggedIn = false;
        }
    }
});

Vue.prototype.$store = store;

// module.exports = store;
export default store
