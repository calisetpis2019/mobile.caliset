<template>
    <Page actionBarHidden="true">
        <FlexboxLayout class="page" backgroundColor="#1F1B24">
            <StackLayout class="form">
                <!--<Image src='https://caliset.com/wp-content/uploads/2019/04/logo-web.png' stretch="aspectFit" />-->
                <Image class="logo" src="~/images/logo.png" stretch="aspectFit"></Image>

                <GridLayout rows="auto, auto, auto" class="grid">

                    <StackLayout row="0" class="input-field">

                        <TextField class="input" hint="Email"
                            keyboardType="email" autocorrect="false"
                            autocapitalizationType="none"
                            returnKeyType="next">
                        </TextField>

                        <StackLayout class="hr-light"></StackLayout>

                    </StackLayout>

                    <StackLayout row="1" class="input-field">

                        <TextField class="input" ref="password"
                            hint="Password" secure="true">
                        </TextField>

                        <StackLayout class="hr-light"></StackLayout>

                    </StackLayout>

                    <!--<ActivityIndicator rowSpan="3" :busy="processing"></ActivityIndicator>-->
                </GridLayout>

                <Button text="Log In" @tap="$goto('home')" class="btn btn-primary m-t-20"></Button> <!-- @tap="$goto('home')" -->
            </StackLayout>
        </FlexboxLayout>
    </Page>
</template>

<script>
/*
    import * as http from "http";

    export default {

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
                url: "http://10.0.0.12:21021/api/TokenAuth/Authenticate",
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
                    this.$goto('home');
                }
            }, error => {
                console.error(error);
                });
            },
        },            

    };
*/
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
