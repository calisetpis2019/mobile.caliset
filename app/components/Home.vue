<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadOperations">
        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=email horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage',{
                    clearHistory: false,
                    props: {
                        email: email,
                        token: token,
                    }})"/> 
            </GridLayout>
        </ActionBar>
        
        <GridLayout rows="2*,3*,auto">

            <StackLayout row="0">

                <Label text="Nuevas Operaciones" class="subtitile" flexWrapBefore="true"/>

                <ListView class="list-group" for="n in added" @itemTap="$goto('newOperation',{
                    clearHistory: false,
                    props: {
                        email: email,
                        token: token,
                        added: added,
                    }})" backgroundColor="#1F1B24">
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

                <Label text="Operaciones Activas" class="subtitile" />

                <ListView class="list-group" for="active in operations"  @itemTap="$goto('operation',{
                    clearHistory: false,
                    props: {
                        email: email,
                        token: token,
                    }})">
                    <v-template>
                        <CardView  margin="10" elevation="40" radius="1" class="card">
                            <StackLayout class="card">
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
    export default {

        props: ['email','token'],

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
                ]
            };
        },

        methods:{
            loadOperations(){
                this.processing=true;
                this.operations = [];
                http.request({
                // Hay que sustituir la ip, obviamente
                url: "http://10.0.2.2:21021/api/services/app/Operation/GetAll",
                method: "GET",
                headers: { "Content-Type": "application/json" },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                        this.hasError = true;
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
                        
                        this.processing=false;
                        //console.log("carga en el arreglo local:");
                        //console.log(operations);
                        
                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                    });
            }
        },


    };
</script>


<!--
<script>
    import Login from "./Login";

    export default {
        data() {
            return {
                message: "You have successfully authenticated. This is where you build your core application functionality."
            };
        },
        methods: {

        }
    };
</script>

-->
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
