import Vue from "nativescript-vue";
import router from './router';

import store from './store'

Vue.prototype.$router = router
Vue.registerElement('CardView', () => require('@nstudio/nativescript-cardview').CardView);


//Esto no funciona con el tns preview:
/*
var firebase = require("nativescript-plugin-firebase");

    firebase.init({
      showNotifications: true,
      showNotificationsWhenInForeground: true,

      onPushTokenReceivedCallback: (token) => {
        console.log('[Firebase] onPushTokenReceivedCallback:', { token });
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
*/

Vue.prototype.$goto = function (to, options) {
    this.$navigateTo(this.$router[to], options)
}

Vue.config.silent = false;

store.commit('load');

var route = "";

if (store.state.loggedIn) {
  route = 'home';
} else {
  route = 'login';
}

new Vue({
    store: store,
    render: h => h('frame', [h(router[route])]),
}).$start()
