<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadOperations();loadNewOperations()">
        <OurActionBar/>
        <PullToRefresh @refresh="refreshLists" >
            <GridLayout rows="auto,*">
                <StackLayout row="0" >

                        <Label text="Nuevas Operaciones" class="subtitle" flexWrapBefore="true"/>

                        <Label  v-if="!processingNO && newOperations.length == 0"
                                text="No hay nuevas operaciones" textWrap="true" class="info"
                                style="margin-top: 20" />

                        <ListView class="list-group" for="n in newOperations" backgroundColor="#1F1B24">
                            <v-template>
                                <CardView  margin="10" elevation="40" radius="1" class="card">
                                    <StackLayout class="card" @tap="goToNewOperation(n)">
                                        <Label :text="'Operación: '+ n.id" class="list-group-item-heading" />
                                        <StackLayout class="container">
                                            <Label :text="'Producto: ' + n.commodity" color="white" />
                                            <Label :text="'Fecha: ' + formatDate(n.date)" color="white" />
                                            <Label :text="'Lugar: ' + n.location.name" color="white" />
                                            <Label :text="'Estado: ' + n.operationState.name"   color="white" />
                                        </StackLayout>
                                    </StackLayout>
                                </CardView>
                            </v-template>
                        </ListView>
                        <ActivityIndicator rowSpan="2" :busy="processingNO" color="white"></ActivityIndicator>
                </StackLayout>

                <StackLayout row="1">

                        <Label  text="Operaciones Activas" class="subtitle" />

                        <Label  v-if="!processing && operations.length == 0"
                                text="No hay operaciones activas a las que esté asignado." textWrap="true" class="info"
                                style="margin-top: 20" />

                        <ListView class="list-group" for="active in operations">
                            <v-template>
                                <CardView  margin="10" elevation="40" radius="1" class="card">
                                    <StackLayout class="card" @tap="goToOperation(active)">
                                        <Label :text="'Operación: '+' '+active.id" class="list-group-item-heading"/>
                                        <StackLayout class="container">
                                            <Label :text="'Producto: ' + active.commodity" color="white"/>
                                            <Label :text="'Fecha: ' + formatDate(active.date)" color="white"  />
                                            <Label :text="'Lugar: ' + active.location.name" color="white"  />
                                            <Label :text="'Estado: ' + active.operationState.name"   color="white"  />
                                        </StackLayout>
                                    </StackLayout>
                                </CardView>
                            </v-template>
                        </ListView>
                        <ActivityIndicator rowSpan="2" :busy="processing" color="white"></ActivityIndicator>

                </StackLayout>

            </GridLayout>
        </PullToRefresh>

    </Page>
</template>

<script>
    import * as http from "http";
    import * as ApplicationSettings from "application-settings";

    export default {

        data() {
            return {
                operations: [],
                idActiva: 2, //Hardcodeado en el backend.
                newOperations: [],
                operationsIds: [],

                processing: false,
                processingNO: false,

            };
        },

        mounted() {
            this.$store.subscribe((mutations, state) => {
                ApplicationSettings.setString("store", JSON.stringify(state));
            });
            this.sendDeviceToken();
        },

        computed: {
            user() {
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            },
            firebaseToken() {
                return this.$store.state.session.deviceToken.token;
            }
        },

        methods: {
            refreshLists(args) {
                var pullRefresh = args.object;
                this.loadNewOperations();
                this.loadOperations();
                setTimeout(function() {
                    pullRefresh.refreshing = false;
                }, 1000);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },

            loadNewOperations(){
                this.processingNO=true;
                this.newOperations = [];
                http.request({
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyOperationsPending",
                method: "GET",
                headers: {
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processingNO=false;
                        console.log(result);
                    }
                    else {

                        console.log("Largo del resultado:");
                        console.log(result.length);
                        console.log("Resultado json:");
                        console.log(result);

                        for(var i = 0; i < result.length; i++){
                            this.newOperations.push(result[i]);
                        }
                        this.newOperations.sort(function(a,b){
                            let x = new Date(a.date);
                            let y = new Date(b.date);
                            return x-y;
                        });
                        this.processingNO=false;

                    }

                }, error => {
                    this.processing=false;
                    console.error(error);
                    });
            },

            loadOperations(){
                this.processing=true;
                this.operations = [];
                http.request({
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyOperationsConfirmed?operationStateId=" + this.idActiva,
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + this.$store.state.session.token },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                        console.log(result);
                    }
                    else {

                        console.log("Largo del resultado:");
                        console.log(result.length);
                        console.log("Resultado json:");
                        console.log(result);

                        for(var i = 0; i < result.length; i++){
                            this.operations.push(result[i]);
                            this.operationsIds.push(result[i].id);

                        }

                        // Se ordenan operaciones por orden ascendente de fecha...
                        this.operations.sort(function(a,b){
                            let x = new Date(a.date);
                            let y = new Date(b.date);
                            return x-y;
                        });

                        console.log("Home: Guardo las operaciones del usuario en el store");
                        console.log(this.operationsIds);
                        this.$store.commit('operations',{ operations: this.operationsIds });
                        this.processing=false;
                        console.log(operations);

                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                    });
            },

            goToNewOperation(newOperation) {
                console.log("Selecciono operacion con nuevas asignaciones ");
                console.log(newOperation.id);
                this.$store.commit('selectedNewOperation',{ selectedNewOperation: newOperation});
                console.log("Nueva operacion guardada:");
                console.log(this.$store.state.selectedNewOperation.id);
                this.$goto('newOperation');
            },

            goToOperation(operation) {
                console.log("Selecciono operacion ");
                console.log(operation.id);
                this.$store.commit('selectedOperation',{ selectedOperation: operation});
                console.log("operacion guardada:");
                console.log(this.$store.state.selectedOperation.id);
                this.$goto('operation');
            },

            sendDeviceToken() {
                if (this.$store.state.session.deviceToken.updated){
                    console.log("http://" + this.$store.state.ipAPI + ":21021/api/services/app/UserDeviceToken/AddDeviceToken?input=" + this.$store.state.session.deviceToken.token);
                    //Se envía deviceToken al back...
                    http.request({
                        url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/UserDeviceToken/AddDeviceToken?input=" + this.$store.state.session.deviceToken.token,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":"Bearer "+ this.$store.state.session.token
                        }
                    }).then(response => {
                        var result = response.content.toJSON().result;
                        if (response.content.toJSON().success) {
                            console.log("Se envió device token con éxito.");
                            console.log(result);
                            this.$store.state.session.deviceToken.updated = false;
                        }
                        else {
                            console.log("Hubo un problema al enviar el device token.");
                        }
                    }, error => {
                        this.processing=false;
                        console.error(error);
                    });
                }
            }

        },


    };
</script>

<style scoped>

    .description-label {
        margin-bottom: 15;
    }

    .newOps {
        font-size: 10px;
    }

    .Ops {
        font-size: 10px;
    }

</style>
