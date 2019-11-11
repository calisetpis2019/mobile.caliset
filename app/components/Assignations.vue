<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadAssignations">
        <OurActionBar/>
        <GridLayout rows="auto,auto,*">

            <Label row="0" text="ASIGNACIONES" class="subtitle" flexWrapBefore="true" textWrap="true" />
            <Label row="1" :text="'Operación ' + this.$store.state.selectedOperation.id + '-' + formatDate(this.$store.state.selectedOperation.date)" class="subtitle" flexWrapBefore="true" textWrap="true" />
            <GridLayout row="2" rows="auto,*">
                <StackLayout row="0">
                    <Label  v-if="!processing && assignations.length == 0"
                            :text="msgEmpty" textWrap="true" class="info"
                            style="margin-top: 20" />
                </StackLayout>
                <PullToRefresh row="1" @refresh="refreshList" >
                    <ListView  class="list-group" for="a in assignations" backgroundColor="#1F1B24">
                        <v-template>
                            <CardView  margin="10" elevation="40" radius="1" class="card">
                                <GridLayout rows="*,auto" class="card">
                                    <StackLayout row="0" class="container">
                                        <Label :text="formatDateHour(a.date) " class="list-group-item-heading"/>
                                        <Label :text="'Tipo: ' + a.operation.operationType.name" color="white" />
                                        <Label :text="'Cliente: ' + a.operation.charger.name" color="white" />
                                        <Label :text="'Cargador: ' + a.operation.charger.name" color="white" />
                                        <Label :text="'Lugar: ' + a.operation.location.name" color="white" />
                                        <Label :text="'Producto: ' + a.operation.commodity" color="white" />
                                        <Label :text="'Embarcación: ' + a.operation.shipName"   color="white" />
                                    </StackLayout >
                                </GridLayout>
                            </CardView>
                        </v-template>
                    </ListView>
                </PullToRefresh>
                <ActivityIndicator :busy="processing" :visibility="processing ? 'visible' : 'collapsed'" color="white"></ActivityIndicator>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script>
    import * as http from "http";
    export default {

        data() {
            return {
                assignations: [], 
                processing: false,
                msgEmpty: "No se pudieron cargar las asignaciones...",
            }
        },

        methods: {
            refreshList(args) {
                var pullRefresh = args.object;
                this.loadAssignations();
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

            loadAssignations() {
                this.assignations = [];
                this.processing=true;
                http.request({
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyAssignmentsByOperation?operationId="+this.$store.state.selectedOperation.id,
                method: "GET",
                headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                    }
                    else {
                        
                        console.log("Largo del resultado:");
                        console.log(result.length);
                        console.log("Resultado json:");
                        console.log(result);
                        
                        for(var i = 0; i < result.length; i++){

                            if (result[i].aware){
                                this.assignations.push(result[i]);    
                            }
                        }
                        this.assignations.sort(function(a,b){
                            let x = new Date(a.date);
                            let y = new Date(b.date);
                            return x-y;
                        });

                        this.processing=false;
                    }
                }, error => {
                    this.processing=false;                
                    console.error(error);
                    });
            }
            
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
    }


</style>
