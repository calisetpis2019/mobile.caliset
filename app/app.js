import Vue from "nativescript-vue";
import router from './router';

Vue.prototype.$router = router
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);

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