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
            state.ipAPI = "10.0.2.2";
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
            state.loggedIn = false;
        }
    }
});

Vue.prototype.$store = store;

// module.exports = store;
export default store
