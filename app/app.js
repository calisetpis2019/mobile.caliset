import Vue from "nativescript-vue";

import Home from "./components/Home";
import Login from "./components/Login";

new Vue({

    template: `
        <Frame>
            <Login />
        </Frame>`,

    components: {
        Home,
        Login,
    }
}).$start();
