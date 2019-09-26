<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadAssignations">

        <!-- <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
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

            <Label row="0" :text="'Asignaciones Operacion:'+this.$store.state.selectedOperation.id" class="subtitle" flexWrapBefore="true"/>

<!--
            <Label row="1" text="Acá se listan las asignaciones de la operación seleccionada"
                    color="white" />
-->
            <ListView row="1" class="list-group" for="a in assignations" backgroundColor="#1F1B24">
                <v-template>
                    <CardView  margin="10" elevation="40" radius="1" class="card">
                        <GridLayout rows="*,auto" class="card">
                            <StackLayout row="0" class="container">
                                <Label :text="a.operation.id + ' : ' + a.date " class="list-group-item-heading"/>
                                <Label :text="'Commodity: ' + a.operation.commodity" color="white"/>
                                <Label :text="'Embarcación: ' + a.operation.shipName"   color="white"  />
                                <Label :text="'Cliente: ' + a.operation.client" color="white"  />
                               <!-- <Label :text="a.aware"   color="white"  />-->
                            </StackLayout >
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
                assignations: [], 
            }
        },

        computed: {
            user() {
                return this.$store.state.session.email;
            }
        },

        methods: {

            loadAssignations() {
                console.log("entro aca!");
                this.assignations = [];
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
                        console.log("fue null??");
                        console.log(result);
                    }
                    else {
                        
                        console.log("entonces aca..");
                        console.log("Largo del resultado:");
                        console.log(result.length);
                        console.log("Resultado json:");
                        console.log(result);
                        
                        for(var i = 0; i < result.length; i++){

                            this.assignations.push(result[i]);
                            /*
                            if (this.assignations.aware == NULL) {
                                this.assignations.aware = "Pendiente";
                            }
                            else if (this.assignations.aware) {
                                this.assignations.aware = "Aceptada";
                            }
                            else {
                                this.assignations.splice(i,1);
                            }*/
                        }

                        this.processing=false;
                    }
                }, error => {
                    console.log("hubo error?");
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
