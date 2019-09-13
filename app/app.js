import Vue from "nativescript-vue";
import router from './router';
import { TNSFontIcon, fonticon } from 'nativescript-fonticon'

Vue.prototype.$router = router
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);

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
/*
new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    }
}).$start();
*/