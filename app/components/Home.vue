<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadOperations();loadNewOperations();loadFutureOperations()">
        <OurActionBar/>
        <PullToRefresh @refresh="refreshLists" >
            <TabView tabBackgroundColor="black" tabTextColor="white" selectedTabTextColor="white">
                <TabViewItem title="Activas">
                    <StackLayout>
                        <Label  v-if="!processing && operations.length == 0"
                                :text="errorA ? msgError : msgActivas" textWrap="true" class="info"
                                style="margin-top: 20" />

                        <ListView class="list-group" for="active in operations">
                            <v-template>
                                <CardView  margin="10" elevation="40" radius="1" class="card">
                                    <StackLayout class="card" @tap="goToOperation(active)">
                                        <Label :text="'Operación '+ active.id + '-' + formatDate(active.date)" class="list-group-item-heading"/>
                                        <StackLayout class="container">
                                            <Label :text="'Producto: ' + active.commodity" color="white"/>
                                            <Label :text="'Fecha: ' + formatDateHour(active.date)" color="white"  />
                                            <Label :text="'Lugar: ' + active.location.name" color="white"  />
                                            <Label :text="'Estado: ' + active.operationState.name"   color="white"  />
                                        </StackLayout>
                                    </StackLayout>
                                </CardView>
                            </v-template>
                        </ListView>
                        <ActivityIndicator rowSpan="2" :busy="processing" color="white"></ActivityIndicator>
                    </StackLayout>
                    
                </TabViewItem>

                <TabViewItem title="Futuras">
                    
                    <StackLayout>
                        <Label  v-if="!processing && futureOperations.length == 0"
                                :text="errorF ? msgError : msgFuturas" textWrap="true" class="info"
                                style="margin-top: 20" />

                        <ListView class="list-group" for="future in futureOperations">
                            <v-template>
                                <CardView  margin="10" elevation="40" radius="1" class="card">
                                    <StackLayout class="card" @tap="goToOperation(future)">
                                        <Label :text="'Operación '+ future.id + '-' + formatDate(future.date)" class="list-group-item-heading"/>
                                        <StackLayout class="container">
                                            <Label :text="'Producto: ' + future.commodity" color="white"/>
                                            <Label :text="'Fecha: ' + formatDateHour(future.date)" color="white"  />
                                            <Label :text="'Lugar: ' + future.location.name" color="white"  />
                                            <Label :text="'Estado: ' + future.operationState.name"   color="white"  />
                                        </StackLayout>
                                    </StackLayout>
                                </CardView>
                            </v-template>
                        </ListView>
                        <ActivityIndicator rowSpan="2" :busy="processing" color="white"></ActivityIndicator>
                    </StackLayout>
                    
                </TabViewItem>

                <TabViewItem title="Nuevas">
                    <StackLayout >

                        <Label  v-if="!processingNO && newOperations.length == 0"
                                :text="errorN ? msgError : msgNuevas" textWrap="true" class="info"
                                style="margin-top: 20" />

                        <ListView class="list-group" for="n in newOperations" backgroundColor="#1F1B24">
                            <v-template>
                                <CardView  margin="10" elevation="40" radius="1" class="card">
                                    <StackLayout class="card" @tap="goToNewOperation(n)">
                                        <Label :text="'Operación '+ n.id + '-' + formatDate(n.date)" class="list-group-item-heading" />
                                        <StackLayout class="container">
                                            <Label :text="'Producto: ' + n.commodity" color="white" />
                                            <Label :text="'Fecha: ' + formatDateHour(n.date)" color="white" />
                                            <Label :text="'Lugar: ' + n.location.name" color="white" />
                                            <Label :text="'Estado: ' + n.operationState.name"   color="white" />
                                        </StackLayout>
                                    </StackLayout>
                                </CardView>
                            </v-template>
                        </ListView>
                        <ActivityIndicator rowSpan="2" :busy="processingNO" color="white"></ActivityIndicator>
                    </StackLayout>
                </TabViewItem>

            </TabView>
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
                idActive: 2, //Hardcodeado en el backend.
                newOperations: [],
                activeOperations: [],

                processing: false,
                processingNO: false,

                futureOperations: [],
                idFuture: 1, //Hardcodeado en el backend.
                
                msgNuevas: "No hay nuevas operaciones",
                msgActivas: "No hay operaciones activas a las que esté asignado.",
                msgFuturas: "No hay operaciones futuras a las que esté asignado.",
                msgError: "No se pudo conectar al servidor.",
                errorN : false,
                errorA : false,
                errorF : false
            };
        },

        mounted() {
            this.$store.subscribe((mutations, state) => {
                ApplicationSettings.setString("store", JSON.stringify(state));
            });
            this.sendDeviceToken();
        },
        
        methods: {
            refreshLists(args) {
                var pullRefresh = args.object;
                this.loadNewOperations();
                this.loadOperations();
                this.loadFutureOperations();
                setTimeout(function() {
                    pullRefresh.refreshing = false;
                }, 1000);
            },

            formatDateHour(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            },

            loadNewOperations(){
                this.processingNO=true;
                this.errorN = false;
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

                        console.log("loadNewOperations: Largo del resultado:");
                        console.log(result.length);
                        console.log("loadNewOperations: Resultado json:");
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
                    this.errorN = true;
                    console.error(error);
                    });
            },

            loadOperations(){
                this.processing=true;
                this.errorA = false;
                this.operations = [];
                this.activeOperations = [];
                http.request({
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyOperationsConfirmed?operationStateId=" + this.idActive,
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + this.$store.state.session.token },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                        console.log(result);
                    }
                    else {

                        console.log("loadOperations: Largo del resultado:");
                        console.log(result.length);
                        console.log("loadOperations: Resultado json:");
                        console.log(result);

                        for(var i = 0; i < result.length; i++){
                            this.operations.push(result[i]);
                            this.activeOperations.push({
                                id: result[i].id,
                                date: result[i].date,
                                operationId: result[i].id + '-' + this.formatDate(result[i].date)
                            });

                        }

                        // Se ordenan operaciones por orden ascendente de fecha...
                        this.operations.sort(function(a,b){
                            let x = new Date(a.date);
                            let y = new Date(b.date);
                            return x-y;
                        });

                        this.$store.commit('activeOperations',{ operations: this.activeOperations });
                        this.processing=false;

                    }
                }, error => {
                    this.processing=false;
                    this.errorA = true;
                    console.error(error);
                    });
            },

            loadFutureOperations(){
                this.processing=true;
                this.errorF = false;
                this.futureOperations = [];
                http.request({
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyOperationsConfirmed?operationStateId=" + this.idFuture,
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + this.$store.state.session.token },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                        console.log(result);
                    }
                    else {

                        console.log("loadFutureOperations: Largo del resultado:");
                        console.log(result.length);
                        console.log("loadFutureOperations: Resultado json:");
                        // console.log(result);

                        for(var i = 0; i < result.length; i++){
                            this.futureOperations.push(result[i]);
                        }

                        // Se ordenan operaciones por orden ascendente de fecha...
                        this.futureOperations.sort(function(a,b){
                            let x = new Date(a.date);
                            let y = new Date(b.date);
                            return x-y;
                        });

                        this.processing=false;
                    }
                }, error => {
                    this.processing=false;
                    this.errorF = true;
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

    .subtitle {
        font-size: 15px;
        font-weight: bold;
    }

</style>
