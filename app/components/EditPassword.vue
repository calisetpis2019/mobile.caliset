<template>
    <Page class="page" backgroundColor="#1F1B24" actionBarHidden="true">

        <GridLayout rows="auto,auto,auto,auto" verticalAlignment="center">

            <StackLayout row="0" >
                <Label text="Contraseña anterior:" class="info"/>
                <Label v-if="incorrectPassword" v-model="errorLabelPwd" color="red"/>
                <TextField v-model="input.pass" class="input" secure="true" @textChange="checkPassword" @focus="clearErrorPwd"/>
            </StackLayout>

            <StackLayout row="1">
                <Label text="Nueva contraseña:" class="info" />
                <Label v-if="incorrectNewPassword" v-model="errorLabelNPwd" color="red" />
                <TextField v-model="input.newPass" class="input" @textChange="checkNewPassword" @focus="clearErrorNPwd"/>
            </StackLayout>

            <StackLayout row="2">
                <Label row="2" text="Repita la nueva contraseña:" class="info" />
                <Label v-if="incorrectNewPassword2" v-model="errorLabelNPwd2" color="red" />
                <TextField v-model="input.newPass2" class="input" @textChange="checkIfNewPasswordMatches" @focus="clearErrorNPwd2" />
            </StackLayout>

            <Button row="3" :isEnabled="ctrl.fst&&ctrl.snd&&ctrl.trd" 
                    class="btn btn-primary" text="Confirmar" @tap="changePassword"/>

        </GridLayout>

    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {
            return {
                ctrl:{
                    fst: false,
                    snd: false,
                    trd: false,
                },
                input:{
                    pass: "",
                    newPass: "",
                    newPass2: "",
                },
                incorrectPassword: false,
                incorrectNewPassword: false,
                incorrectNewPassword2: false,
                errorLabelPwd: "La contraseña es incorrecta.",
                errorLabelNPwd: "La contraseña debe incluir un caracter numérico,\n uno en mayúsculas y otro en minúsculas \ny ser de largo 8 o mayor.",
                errorLabelNPwd2: "La contraseña no coincide.",
            }
        },

        computed: {

        },

        methods: {

            checkPassword() {
                
                if (this.input.pass != this.$store.state.session.password){

                    this.incorrectPassword = true;
                    this.ctrl.fst=false;
                }
                else {
                    this.incorrectPassword = false;
                    this.ctrl.fst=true;
                }
                
            },

            checkNewPassword() {
                var patt = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
                //var res = patt.test(this.input.newPass);
                if (!(patt.test(this.input.newPass))) {
                    console.log("verdadero");
                    this.incorrectNewPassword = true;
                    this.ctrl.snd=false;
                }
                else {
                    this.incorrectNewPassword = false;
                    this.ctrl.snd=true;
                }
            },

            checkIfNewPasswordMatches() {
                if (!( this.input.newPass == this.input.newPass2)){
                    this.incorrectNewPassword2 = true;
                    this.ctrl.trd=false;
                }
                else{
                    this.incorrectNewPassword2 = false;
                    this.ctrl.trd=true;
                }
            },

            clearErrorPwd() {
                this.incorrectPassword = false;
            },

            clearErrorNPwd() {
                this.incorrectNewPassword = false;
            },

            clearErrorNPwd2() {
                this.incorrectNewPassword2 = false;
            },

            changePassword() {
                http.request({
                    // Hay que sustituir la ip, obviamente
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/User/ChangePassword",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    content: JSON.stringify({
                        "currentPassword": this.input.pass,
                        "newPassword": this.input.newPass,
                    })
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing = false;
                        this.errorMsg = "No se realizó el cambio: La respuesta vino vacía";
                        alert(this.errorMsg);
                        console.log("respuesta vacía");
                        console.log(result);
                        this.$goto('login',{ clearHistory: true });
                    }
                    else {
                        console.log("respondio OK");
                        console.log(result);
                        alert("Se ha cambiado la contraseña");
                        this.$goto('home',{ clearHistory: true });
                    }
                }, error => {
                    console.log("respondió con error");
                    this.processing = false;
                    this.errorMsg = "Falló la conexión. Por favor intente luego.";
                    alert(this.errorMsg);
                    console.error(error);
                    this.$goto('login',{ clearHistory: true });
                    });
            },


        }
    };

</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .fa {
        color: $accent-dark;
    }

    .info {
        font-size: 20;
        color: white;
    }


</style>
