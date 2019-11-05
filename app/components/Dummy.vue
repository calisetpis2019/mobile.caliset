<template>
    <Page class="page" backgroundColor="#1F1B24" actionBarHidden="true" @navigatedTo="checks">
        <ActivityIndicator width="100" height="100" busy="" />
    </Page>
</template>

<script>
    import * as ApplicationSettings from "application-settings";

    export default {

        data() {
            return {

            }
        },

        mounted() {
            this.$store.subscribe((mutations, state) => {
                ApplicationSettings.setString("store", JSON.stringify(state));
            });
        },

        methods: {
            checks(){
                if (this.$store.state.loggedIn) {
                    // Verifico si hace más de un año está logueado...
                    var d = new Date();
                    var year = d.getFullYear();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    // Si el año actual es mayor al año de inicio de sesión...
                    if (this.$store.state.session.date.year < year) {
                        // Y si es mayor el mes, o es el mismo mes pero el día es mayor... 
                        //Se que ya pasó más de un año y lo deslogueo
                        if ((this.$store.state.session.date.month < month) || (this.$store.state.session.date.month == month && this.$store.state.session.date.day < day)) {
                            this.$store.commit('logout');
                            this.$goto('login',{ clearHistory: true });
                        }
                    }
                    this.$store.commit('startGPS');
                    this.$store.commit('startSendingPendings');
                    this.$goto('home',{ clearHistory: true });
                }
                else if (this.$store.state.firstLogIn) {
                    this.$goto('termsAndConditions',{ clearHistory: true });
                }
                else {
                    this.$goto('login',{ clearHistory: true });
                }
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
