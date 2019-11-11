<template>
    <Page class="page" >
    <ActionBar title="Cambio de contraseña" class="action-bar subtitle" backgroundColor="#1F1B24"  />
    <FlexboxLayout class="page" backgroundColor="#1F1B24">
        <ScrollView>
            <GridLayout rows="auto,auto,auto,auto,*,auto" class="grid">
                <StackLayout row="0" verticalAlignment="top">
                    <Label v-if="equalPasswords" v-model="errorLabelEqualPwds" color="red" textWrap="true" />
                </StackLayout>
                <StackLayout class="hr-light"/>
                <StackLayout class="hr-light"/>

                <StackLayout row="1" class="form">
                    <Label text="CONTRASEÑA ACTUAL" class="subtitle" />
                    <Label v-if="incorrectPassword" v-model="errorLabelPwd" color="red" textWrap="true" />
                    <TextField v-model="input.pass" class="input" secure="true" @textChange="checkPassword" returnKeyType="next"/>
                    <StackLayout class="hr-light"/>
                    <StackLayout class="hr-light"/>
                </StackLayout>


                <StackLayout row="2" class="form">
                    <Label text="NUEVA CONTRASEÑA" class="subtitle" />
                    <Label v-if="incorrectNewPassword" v-model="errorLabelNPwd" color="red" textWrap="true" />
                    <TextField v-model="input.newPass" class="input" secure="true" @textChange="checkNewPassword" returnKeyType="next" />
                    <StackLayout class="hr-light"/>
                    <StackLayout class="hr-light"/>
                </StackLayout>


                <StackLayout row="3" class="form">
                    <Label text="REPITA LA NUEVA CONTRASEÑA" class="subtitle" />
                    <Label v-if="incorrectNewPassword2" v-model="errorLabelNPwd2" color="red" textWrap="true" />
                    <TextField v-model="input.newPass2" class="input" secure="true" @textChange="checkIfNewPasswordMatches" returnKeyType="done"/>
                    <StackLayout class="hr-light"/>
                    <StackLayout class="hr-light"/>
                </StackLayout>


                <ActivityIndicator row= "4" :busy="processing" color="white"></ActivityIndicator>
                
                <Button row="5" :isEnabled="ctrl.fst&&ctrl.snd&&ctrl.trd&&!processing" style="padding: 10"
                        class="btn btn-primary" text="Confirmar" @tap="changePassword"/>

            </GridLayout>
        </ScrollView>
    </FlexboxLayout>
    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {
            return {
                processing: false,
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
                equalPasswords: false,
                errorLabelPwd: "La contraseña es incorrecta.",
                errorLabelNPwd: "La contraseña debe incluir un caracter numérico,\n uno en mayúsculas y otro en minúsculas \ny ser de largo 8 o mayor.",
                errorLabelNPwd2: "La contraseña no coincide.",
                errorLabelEqualPwds: "La contraseña actual y la nueva son iguales y deben ser distintas.",
            }
        },

        methods: {
            checkPassword() {
                this.input.newPass = "";
                this.equalPasswords = false;
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
                this.input.newPass2="";
                this.equalPasswords = false;
                var patt = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
                if (!(patt.test(this.input.newPass))) {
                    this.incorrectNewPassword = true;
                    this.ctrl.snd=false;
                }
                else {
                    this.incorrectNewPassword = false;
                    if (this.input.pass == this.input.newPass){
                        this.equalPasswords = true;
                    }
                    else {
                        this.ctrl.snd=true;
                    }
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

            changePassword() {
                this.processing = true;
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/User/ChangePassword",
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
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
                        console.log("changePassword: respuesta vacía");
                        // Si hubo error debo borrar los datos del login...
                        this.$store.commit('logout');
                        // Acá hay que ver si mandar al login de nuevo o si quedamos acá esperando que cambie la contraseña
                        this.$goto('login',{ clearHistory: true });
                    }
                    else {
                        console.log("changePassword respondio OK");
                        console.log(result);
                        // Se actualiza nueva pass en el store...
                        this.$store.state.session.password = this.input.newPass;
                        if (this.$store.state.session.firstLogin) {
                            this.setFirstLogin();
                        }
                        else {
                            this.$goto('home',{ clearHistory: true });
                        }
                        
                    }
                }, error => {
                    console.log("respondió con error");
                    this.processing = false;
                    this.errorMsg = "Falló la conexión. Por favor intente luego.";
                    alert(this.errorMsg);
                    console.error(error);
                    // Si hubo error debo borrar los datos del login...
                    this.$store.commit('logout');
                    // Acá hay que ver si mandar al login de nuevo o si quedamos acá esperando que cambie la contraseña
                    this.$goto('login',{ clearHistory: true });
                });
            },

            setFirstLogin() {
                console.log("userId");
                console.log(this.$store.state.session.userId);
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/User/SetFirstLogin",
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token,
                    },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing = false;
                        this.errorMsg = "No se pudo actualizar firstLogIn";
                        alert(this.errorMsg);
                        console.log("setFirstLogin: respuesta vacía");
                        // Si hubo error debo borrar los datos del login...
                        this.$store.commit('logout');
                        // Acá hay que ver si mandar al login de nuevo o si quedamos acá esperando que cambie la contraseña
                        this.$goto('login',{ clearHistory: true });
                    }
                    else {
                        console.log("setFirstLogIn respondio OK");
                        console.log(result);
                        alert("Usuario modificado con éxito!");
                        this.$store.state.session.firstLogIn = false;
                        this.$store.state.loggedIn = true;
                        // Se guarda la fecha de inicio de sesión
                        var d = new Date();
                        this.$store.state.session.date.year = d.getFullYear();
                        // Se suma 1 porque da valores entre 0 y 11
                        this.$store.state.session.date.month = d.getMonth() + 1;
                        this.$store.state.session.date.day = d.getDate();
                        this.$goto('home',{ clearHistory: true });
                    }
                }, error => {
                    console.log("respondió con error");
                    this.processing = false;
                    this.errorMsg = "Falló la conexión. Por favor intente luego.";
                    alert(this.errorMsg);
                    console.error(error);
                    // Si hubo error debo borrar los datos del login...
                    this.$store.commit('logout');
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
</style>
