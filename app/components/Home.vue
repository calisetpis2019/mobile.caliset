<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadOperations">
        <!-- <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" />
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
        <GridLayout rows="2*,3*,auto">

            <StackLayout row="0">

                <Label text="Nuevas Operaciones" class="subtitle" flexWrapBefore="true"/>

                <ListView class="list-group" for="n in added" @itemTap="$goto('newOperation')" backgroundColor="#1F1B24">
                    <v-template>
                        <CardView  margin="10" elevation="40" radius="1" class="card">
                            <StackLayout class="card">
                                <Label :text="n.name" class="list-group-item-heading"/>
                                <StackLayout class="container">
                                    <Label :text="n.type" color="white"/>
                                    <Label :text="n.load"   color="white"  />
                                    <Label :text="n.client" color="white"  />
                                    <Label :text="n.date"   color="white"  />
                                </StackLayout>
                            </StackLayout>
                        </CardView>
                    </v-template>
                </ListView>
            </StackLayout>

            
            <StackLayout row="1">

                <Label text="Operaciones Activas" class="subtitle" />

                <!--@itemTap="goToOperation(active.id)" Esto iba ListView-->
                <ListView class="list-group" for="active in operations" >
                    <v-template>
                        <CardView  margin="10" elevation="40" radius="1" class="card">
                            <StackLayout class="card" @tap="goToOperation(active)">
                                <Label :text="'Operacion'+' '+active.id" class="list-group-item-heading"/>
                                <StackLayout class="container">
                                    <Label :text="active.commodity+' | '+active.destiny+' | '+active.date" color="white"/>
                                </StackLayout>
                            </StackLayout>
                        </CardView>
                    </v-template>
                </ListView>
                <ActivityIndicator rowSpan="2" :busy="processing" color="white"></ActivityIndicator>

            </StackLayout>

            <StackLayout row="2">

                <Button text="cargar opes" class="btn-primary" @tap="loadOperations"> </Button>

            </StackLayout>

        </GridLayout>

    </Page>
</template>

<script>
    import * as http from "http";
    import * as ApplicationSettings from "application-settings";

    export default {

        data() {
            return {
                operations: [],

                processing: false,

                added: [{
                        name: "Operación 5",
                        type: "Carga",
                        load: "Arroz",
                        client: "SAMAN",
                        date: "11/10/2019"
                    },
                    {
                        name: "Operación 6"
                    }
                ],
            };
        },

        mounted() {

            this.$store.subscribe((mutations, state) => {
                ApplicationSettings.setString("store", JSON.stringify(state));
            });
        },

        computed: {
            user() {
                return this.$store.state.session.email;
            }
        },

        methods: {

            loadOperations(){
                this.processing=true;
                this.operations = [];
                http.request({
                // Hay que sustituir la ip, obviamente
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Operation/GetAll",
                method: "GET",
                headers: { "Content-Type": "application/json" },
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
                        }
                        
                        console.log("Home: Guardo las operaciones del usuario en el store");
                        this.$store.commit('operations',{ operations: this.operations });
                        this.processing=false;
                        //console.log("carga en el arreglo local:");
                        //console.log(operations);
                        
                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                    });
            },

            goToOperation(operation) {
                console.log("Selecciono operacion ")
                console.log(operation.id);
                this.$store.commit('selectedOperation',{ selectedOperation: operation});
                console.log("operacion guardada:");
                console.log(this.$store.state.selectedOperation.id);
                this.$goto('operation');
            },

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
