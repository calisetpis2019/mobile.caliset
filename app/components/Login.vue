<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="Login"></Label>
        </ActionBar>

        <FlexboxLayout class="page">
            <StackLayout class="form" id="stack1">
            <Image src='https://caliset.com/wp-content/uploads/2019/04/logo-web.png' stretch="aspectFit" />
                
                <TextField hint="Email" v-bind:class="{'text-danger': hasError}" autocapitalizationType="none" keyboardType="email" class="input input-border m-t-10" v-model="user.email" returnKeyType="next" @tap="hasError = false" />
                <StackLayout class="hr-light"></StackLayout>
                <TextField hint="Password" v-bind:class="{'text-danger': hasError}" secure="true" class="input input-border m-t-10" v-model="user.password" returnKeyType="done" @tap="hasError = false" />
                <StackLayout class="hr-light"></StackLayout>

                <Button text="Log in" class="btn btn-outline btn-rounded-sm btn-active m-t-10" @tap="login()"></Button>
                
            </StackLayout>
        </FlexboxLayout>
    </Page>
</template>

<script>
    import * as http from "http";
    import Home from "./Home";
    import { alert, prompt } from "tns-core-modules/ui/dialogs";

    export default {
        mounted() {

        },
        computed: {
            message() {
                return "<!-- Page content goes here -->";
            }
        },

        data() {
            return {
                user: {
                    email: "",
                    password: "",
                    token: ""
                },
                hasError: false,
            };
        },

        methods: {
            login(){
                // Si alguno de los dos campos esta vacio se marca un error
                if (!this.user.email || !this.user.password) {
                    this.hasError = true;
                    return;
                }
                http.request({
                // Hay que sustituir la ip, obviamente
                url: "http://192.168.1.2:21021/api/TokenAuth/Authenticate",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    "userNameOrEmailAddress": this.user.email,
                    "password": this.user.password,
                    "rememberClient": true
                })
            }).then(response => {
                var result = response.content.toJSON().result;
                if (result == null) {
                    this.hasError = true;
                    console.log(result);
                }
                else {
                    this.user.token = result.accessToken;
                    var userId = result.userId;
                    console.log("Token:" + this.user.token);
                    console.log("userId:" + userId);
                    this.$navigateTo(Home,{
                        clearHistory: true,
                        props: {
                            email: this.user.email,
                            token: this.user.token,
                        }
                    });
                }
            }, error => {
                console.error(error);
            });
            },
        },
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    .form {
        margin-left: 30;
        margin-right: 30;
        flex-grow: 2;
        vertical-align: middle;
    }
    // Custom styles
</style>