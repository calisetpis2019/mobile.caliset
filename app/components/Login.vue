<template>
    <Page class="page" actionBarHidden="true">
        <FlexboxLayout class="page" backgroundColor="#1F1B24">
                <GridLayout rows="*,auto,auto,auto" class="grid">
                <!-- <StackLayout class="input-field"> -->
                    <Image row="0" class="logo" src="~/images/logo.png" stretch="aspectFit"></Image>
                    <Label row="1" :text="errorMsg" color="red" textWrap=true textAlignment="center" />
                    <StackLayout row="2" class="form">
                        
                        <TextField row="2" class="input" hint="Email"
                            keyboardType="email" autocorrect="false"
                            autocapitalizationType="none"
                            returnKeyType="next" v-model="user.email" >
                        </TextField>

                        <StackLayout class="hr-light"></StackLayout>

                    <!-- </StackLayout> -->

                    <!-- <StackLayout  class="input-field"> -->

                        <TextField row="3" class="input" ref="password" returnKeyType="done"
                            hint="Password" secure="true" v-model="user.password" >
                        </TextField>

                        <StackLayout class="hr-light"></StackLayout>

                        <!-- </StackLayout> -->

                    <!-- <ActivityIndicator rowSpan="3" :busy="processing"></ActivityIndicator> -->
                    </StackLayout>

                <Button row="4" text="Log In" class="btn btn-primary m-t-20" @tap="login()"></Button> 
                <!-- @tap="$goto('home',{
                    clearHistory: true,
                    props: {
                        email: "email@falso.com",
                        token: token,
                    }})" -->
                
                <!-- <ActivityIndicator :busy="processing" /> -->
                </GridLayout>
        </FlexboxLayout>
    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {

            return {
                user: {
                    email: "",
                    password: "",
                    token: ""
                },
                errorMsg: "",
                processing: false,
            };

        },

        methods: {
            login(){
                this.processing = true;
                // Si alguno de los dos campos esta vacio se marca un error
                if (!this.user.email || !this.user.password) {
                    this.processing = false;                
                    this.errorMsg = "Debe ingresar correo y contraseña";
                    return;
                }
                http.request({
                // Hay que sustituir la ip, obviamente
                url: "http://10.0.2.2:21021/api/TokenAuth/Authenticate",
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
                        this.processing = false;
                        this.errorMsg = "Ingrese correo y contraseña válidos.";
                        console.log(result);
                    }
                    else {
                        this.user.token = result.accessToken;
                        var userId = result.userId;
                        console.log("Token:" + this.user.token);
                        console.log("userId:" + userId);
                        this.$goto('home',{
                            clearHistory: true,
                            props: {
                                email: this.user.email,
                                token: this.user.token,
                            }
                        });
                    }
                }, error => {
                    this.processing = false;
                    this.errorMsg = "Falló la conexión. Por favor intente luego.";
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

    // Custom styles
    .page {
        align-items: center;
        flex-direction: column;
    }

    .form {
        margin-left: 30;
        margin-right: 30;
        flex-grow: 2;
        vertical-align: middle;
    }

    .logo {
        margin-bottom: 130;
        height: 120;
        font-weight: bold;
    }

    .header {
        horizontal-align: center;
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color: #D51A1A;
    }

    .input-field {
        margin-bottom: 25;
    }

    .input {
        font-size: 18;
        placeholder-color: #FFFFFF;
        color: #FFFFFF;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }

    .btn-primary {
        margin: 30 5 15 5;
    }

    .login-label {
        horizontal-align: center;
        color: #A8A8A8;
        font-size: 16;
    }

    .sign-up-label {
        margin-bottom: 20;
    }
</style>
