import Vue from "nativescript-vue";
import router from './router';
import { TNSFontIcon, fonticon } from 'nativescript-fonticon'

Vue.prototype.$router = router
Vue.registerElement('CardView', () => require('@nstudio/nativescript-cardview').CardView);

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

TNSFontIcon.debug = true
TNSFontIcon.paths = {
  'fa': './assets/fontawesome.css',
}
TNSFontIcon.loadCss()
Vue.filter('fonticon', fonticon)



Vue.prototype.$goto = function (to, options) {
    this.$navigateTo(this.$router[to], options)
}

Vue.config.silent = false;


new Vue({
    render: h => h('frame', [h(router['login'])])
}).$start()
