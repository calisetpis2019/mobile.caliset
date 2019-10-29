<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadAssignations">
        <OurActionBar/>
        
        <GridLayout rows="auto,auto,auto,*">
            <Label row="0" text="Alertas" class="subtitle" flexWrapBefore="true" textWrap="true" />
            <Label row="1" :text="'Operación ' + this.$store.state.selectedNewOperation.id + '-' + formatDate(operDate)" class="subtitle" flexWrapBefore="true" textWrap="true" />
            <Label row="2" :text="msg" :visibility="msg != '' ? 'visible' : 'collapsed'" class="info" textWrap="true"/>
        
            <PullToRefresh row="3" @refresh="refreshList" >
                <ListView class="list-group" for="a in assignations" backgroundColor="#1F1B24">
                    <v-template>
                        <CardView  margin="10" elevation="40" radius="1" class="card">
                            <GridLayout rows="*,auto" class="card">
                                <StackLayout row="0" class="container" @tap="showButtons">
                                    <Label :text="'Operación ' + a.operation.id + '-' + formatDate(operDate)" class="list-group-item-heading"/>
                                    <Label :text="'Fecha: ' + formatDateHour(a.date)"   color="white"  />
                                    <Label :text="'Tipo: '  + a.operation.operationType.name" color="white"/>
                                    <Label :text="'Nominador: '  + a.operation.nominator.name"   color="white"  />
                                    <Label :text="'Cargador: '  + a.operation.charger.name" color="white"  />
                                </StackLayout >
                                <StackLayout row="1" :visibility="isIt ? 'visible' : 'collapsed'" horizontalAlign="center" orientation="horizontal" margin="10">
                                    <Button textWrap="true" text.decode="&#xf00c;" class="btn-confirm fas" width="50%" 
                                            @tap="confirmAssignation(a)" />
                                    <Button textWrap="true" text.decode="&#xf00d;" class=" btn-reject fas" width="50%" 
                                            @tap="rejectAssignation(a)"/>
                                </StackLayout>
                            </GridLayout>
                        </CardView>
                    </v-template>
                </ListView>
            </PullToRefresh>

        </GridLayout>
    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {
            return {
                isIt: true,
                assignations: [],
                msg: "",
                operDate: this.$store.state.selectedNewOperation.date
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
                http.request({
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyAssignmentsByOperation?operationId="+this.$store.state.selectedNewOperation.id,
                method: "GET",
                headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                        console.log(result);
                    }
                    else {
                        console.log("NewOperation: Largo del resultado:");
                        console.log(result.length);
                        console.log("Resultado json:");
                        console.log(result);
                        for(var i = 0; i < result.length; i++){

                            if (result[i].aware == null){
                                this.assignations.push(result[i]);
                                this.msg = "";
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

            },

            confirmAssignation(assignation){
                const index = this.assignations.indexOf(assignation);
                this.assignations.splice(index,1);
                this.processing=true;
                var len = this.assignations.length;
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/AceptAssignation?AssignationId="+assignation.id,
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
                }).then(response => {
                    var success = response.content.toJSON().success;
                    if (success){
                        console.log("confirmAssignation: respondio OK");
                        if (len == 0){
                            this.msg = "No tiene más asignaciones pendientes para esta operación.";
                            // Acá también se podría hacer que vaya directo al home... Es discutible
                        }
                        this.processing=false;
                    }
                    else {
                        this.processing=false;
                        console.log("no se pudo confirmar, hubo error.");
                    }
                }, error => {
                    console.log("respondió con error");
                    this.processing = false;
                    this.errorMsg = "Falló la conexión. Por favor intente luego.";
                    alert(this.errorMsg);
                    console.error(error);
                });
            },

            rejectAssignation(assignation){
                const index = this.assignations.indexOf(assignation);
                this.assignations.splice(index,1);
                this.processing=true;
                var len = this.assignations.length;
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/RefuseAssignation?AssignationId="+assignation.id,
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
                }).then(response => {
                    var success = response.content.toJSON().success;
                    if (success){
                        console.log("rejectAssignation: respondio OK");
                        if (len == 0){
                            this.msg = "No tiene más asignaciones pendientes para esta operación.";
                            // Acá también se podría hacer que vaya directo al home... Es discutible
                        }
                        this.processing=false;
                    }
                    else {
                        this.processing=false;
                        console.log("no se pudo confirmar, hubo error.");
                    }
                }, error => {
                    console.log("respondió con error");
                    this.processing = false;
                    this.errorMsg = "Falló la conexión. Por favor intente luego.";
                    alert(this.errorMsg);
                    console.error(error);
                });
            },

            showButtons() {
                //Esto no anda, no se porque...
                console.log("btonbotontotnot");

                if (this.isIt) {
                    this.isIt = false;
                }
                else {
                    console.log("muestra los botones!");
                    this.isIt = true;
                }

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
    }


</style>
