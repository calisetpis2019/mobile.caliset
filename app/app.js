import Vue from "nativescript-vue";

import Home from "./components/Home";
import Login from "./components/Login";


//prueba git

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
