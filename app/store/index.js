import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as ApplicationSettings from "application-settings";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        session : {
            email: "",
            token: "",
        },
        ipAPI : "192.168.1.43",
        loggedIn: false,
    },
    mutations: {
        load(state) {
            if(ApplicationSettings.getString("store")) {
                this.replaceState(
                    Object.assign(state, JSON.parse(ApplicationSettings.getString("store")))
                );
            }
        },
        login(state, data) {
            state.session.email = data.email;
            state.session.token = data.token;
            state.loggedIn = true;
        },
        logout(state) {
            state.session.email = "";
            state.session.token = "";
            state.loggedIn = false;
        }
    }
});

Vue.prototype.$store = store;

// module.exports = store;
export default store
