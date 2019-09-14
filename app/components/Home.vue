<template>
    <Page class="page" backgroundColor="#1F1B24">
        <!--<ActionBar title="YOUR APP"></ActionBar>-->
        <ActionBar title="Operaciones" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label :text=email horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>
        
        <!-- <ScrollView backgroundColor="#1F1B24"> -->
            <!--Add your page content here-->
        <FlexboxLayout class="page" flexDirection="column" backgroundColor="#1F1B24">

            <GridLayout rows="*,*,auto" >
              
            <!--<StackLayout orientation="vertical" class="sub-panel">-->
                <StackLayout row="0" orientation="vertical">

                    <Label text="Nuevas Asignaciones" class="subtitile" flexWrapBefore="true"/>

                    <ListView class="list-group" for="nueva in nuevas" @itemTap="$goto('newOperation',{
                        clearHistory: false,
                        props: {
                            email: email,
                            token: token,
                        }})" >
                        <v-template>
                            <GridLayout flexDirection="row" class="list-group-item">
                                <Label :text="nueva.name" class="list-group-item-heading" />
                            </GridLayout>
                        </v-template>
                    </ListView>
                </StackLayout>
                
                <StackLayout row="1" orientation="vertical">

                <Label text="Operaciones Asignadas" class="subtitile" />

                <!--<StackLayout orientation="vertical" class="sub-panel">-->
                    <ListView class="list-group" for="activa in activas" @itemTap="$goto('operation',{
                        clearHistory: false,
                        props: {
                            email: email,
                            token: token,
                        }})" >
                        <v-template>
                            <GridLayout flexDirection="row" class="list-group-item">
                                <Label :text="activa.name" class="list-group-item-heading" />
                            </GridLayout>
                        </v-template>
                    </ListView>
                </StackLayout>

                    <Button row="2" text="REGISTRO DE HORAS" @tap="$goto('timeSheet',{
                        clearHistory: false,
                        props: {
                            email: email,
                            token: token,
                        }})" class="btn btn-primary m-t-20" ></Button>
            </GridLayout>

            <!--</StackLayout>-->
        </FlexboxLayout>

       <!-- </ScrollView> -->
    </Page>
</template>

<script>
    export default {

        props: ['email','token'],

        data() {
            return {
                activas: [{
                        name: "Operación 1"
                    },
                    {
                        name: "Operación 2"
                    },
                    {
                        name: "Operación 36"
                    },
                    {
                        name: "Operación 4"
                    },
                    {
                        name: "Operacion 24"
                    },
                    {
                        name: "Operacion 42"
                    },
                    {
                        name: "Operacion 69"
                    },
                    {
                        name: "Operacion 420"
                    },
                    {
                        name: "Operacion 420"
                    },
                    {
                        name: "Operacion 420"
                    },
                    {
                        name: "Operacion 420"
                    },
                    {
                        name: "Operacion 420"
                    },
                    {
                        name: "Operacion 420"
                    },
                    {
                        name: "Operacion 345"
                    }
                ],
                nuevas: [{
                        name: "Operación 5"
                    },
                    {
                        name: "Operación 6"
                    },
                    {
                        name: "Operación 7"
                    },
                    {
                        name: "Operación 8"
                    },
                    {
                        name: "Operación 9"
                    }
                ]
            };
        }
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
    .subtitile {
        text-align: center;
        font-size: 30px;
        background-color: #1F1B24;
        color: white;
    }

    .action-bar {
        margin-bottom: 10;
    }

    .list-group-item-heading {
        color: white;
    }
/*
    .list-group-item {
        background : gray;
    }
*/
    .list-group {
        margin: 15;
        margin-bottom: 50;
        background-color:#1F1B24;
    }

    .list-new {
        height: 200px;
        
    }

</style>
