import Vue from "nativescript-vue";
import router from './router';
import OurActionBar from './components/OurActionBar'
import TimeSheet from './components/TimeSheet'
import Pickers from './components/Pickers'

import store from './store';

Vue.component('OurActionBar',OurActionBar);
Vue.component('TimeSheet',TimeSheet);
Vue.component('Pickers',Pickers);

Vue.prototype.$router = router;

Vue.prototype.$goto = function (to, options) {
    this.$navigateTo(this.$router[to], options)
}

Vue.registerElement('CardView', () => require('@nstudio/nativescript-cardview').CardView);
Vue.registerElement('PullToRefresh',() => require('@nstudio/nativescript-pulltorefresh').PullToRefresh);

store.commit('load');

var firebase = require("nativescript-plugin-firebase");

firebase.init({
    showNotifications: true,
    showNotificationsWhenInForeground: true,

    onPushTokenReceivedCallback: (token) => {
        console.log('[Firebase] onPushTokenReceivedCallback:', { token });
        if (store.state.session.deviceToken.token != token){
            store.commit('saveDeviceToken', {token: token});
        }
    },

    onMessageReceivedCallback: (message) => {
        console.log('[Firebase] onMessageReceivedCallback:', { message });
        if (message.data.msg == "Usuario eliminado") {
            store.commit('logout');
            Vue.prototype.$goto('login',{ clearHistory: true });
        }
    }
})
    .then(() => {
        console.log('[Firebase] Initialized');
    })
    .catch(error => {
        console.log('[Firebase] Initialize', { error });
    });


Vue.config.silent = false;

new Vue({
    store: store,
    // Para evitar que se muestre home cuando no está iniciado, 
    // siempre inicia en dummy y va a donde corresponda
    render: h => h('frame', [h(router['dummy'])]),
}).$start()
