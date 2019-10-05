import Vue from "nativescript-vue";
import router from './router';

import store from './store';

Vue.prototype.$router = router;
Vue.registerElement('CardView', () => require('@nstudio/nativescript-cardview').CardView);

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
    }
})
    .then(() => {
        console.log('[Firebase] Initialized');
    })
    .catch(error => {
        console.log('[Firebase] Initialize', { error });
    });


Vue.prototype.$goto = function (to, options) {
    this.$navigateTo(this.$router[to], options)
}

Vue.config.silent = false;

new Vue({
    store: store,
    // Para evitar que se muestre home cuando no está iniciado, 
    // siempre inicia en dummy y va a donde corresponda
    render: h => h('frame', [h(router['dummy'])]),
}).$start()
