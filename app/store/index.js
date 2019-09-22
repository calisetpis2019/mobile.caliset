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
        ipAPI : "10.0.2.2",
        //ipAPI : "172.20.10.2",
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
            state.session.password = data.password
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
