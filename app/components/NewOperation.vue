<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadAssignations">

        <!-- <ActionBar title="NewOperation" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/> 
            </GridLayout>
        </ActionBar> -->
        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="auto,*,*" >
                <Image row="0" col="0" src="~/images/logo.png" class="action-image" stretch="aspectFit" height="140px" horizontalAlignment="left"></Image>
                <Button row="0" col="2" :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/>
            </GridLayout>
        </ActionBar>
        
        <GridLayout rows="auto,*">


            <Label row="0" :text="'Alertas Operación: ' + this.$store.state.selectedNewOperation.id" class="subtitle" flexWrapBefore="true"/>
<!--
            <Label row="1" text="En Construcción..." class="subtitle" flexWrapBefore="true" style="margin-top: 20"/>

            <Label row="2" text.decode="&#xf0ad; " class="fas" style="font-size:140; padding: 40;color: gray"
                        verticalAlignment="center" horizontalAlignment="center"/>
-->

            <ListView row="1" class="list-group" for="a in assignations" backgroundColor="#1F1B24">
                <v-template>
                    <CardView  margin="10" elevation="40" radius="1" class="card">
                        <GridLayout rows="*,auto" class="card">
                            <StackLayout row="0" class="container" @tap="showButtons">
                                <Label :text="'Operación: ' + a.operation.id" class="list-group-item-heading"/>
                                <Label :text="'Fecha: ' + a.date"   color="white"  />
                                <Label :text="'Tipo: '  + a.operation.operationType.id" color="white"/>
                                <Label :text="'Nominador: '  + a.operation.nominator.id"   color="white"  />
                                <Label :text="'Cargador: '  + a.operation.charger.id" color="white"  />
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
            }
        },

        computed: {
            user() {
                // return this.$store.state.session.email;
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            }
        },

        methods: {

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
                            }
                        }

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
                http.request({
                    // Hay que sustituir la ip, obviamente
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/AceptAssignation?AssignationId="+assignation.id,
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
                }).then(response => {
                    var success = response.content.toJSON().success;
                    if (success){
                        console.log("confirmAssignation: respondio OK");
                        console.log(result);
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
                http.request({
                    // Hay que sustituir la ip, obviamente
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/RefuseAssignation?AssignationId="+assignation.id,
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token },
                }).then(response => {
                    var success = response.content.toJSON().success;
                    if (success){
                        console.log("rejectAssignation: respondio OK");
                        console.log(result);
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
