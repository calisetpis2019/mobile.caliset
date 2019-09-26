<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadComments">

        <!-- <ActionBar title="Operation" class="action-bar" backgroundColor="#1F1B24" >
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
        
        <GridLayout rows="auto,*,auto" >

            <StackLayout row="0" >
                <Label :text="'Operación '+ this.$store.state.selectedOperation.id" class="info"/>
                <StackLayout horizontalAlign="center" orientation="horizontal" margin="10">
                    <Button textWrap="true" text="Asignaciones" class="btn-primary" width="50%" 
                            @tap="$goto('assignations')"/>
                    <Button textWrap="true" text="Informacion" class=" btn-primary" width="50%" 
                            @tap="$goto('information')"/>
                </StackLayout>
            </StackLayout>

            <ScrollView row="1" class="chat" backgroundColor="#1F1B24">
                <ListView class="list-group" for="c in comments" separatorColor="#1F1B24"> <!--for="for c in comments" -->
                    <v-template>
                        <CardView margin="10" elevation="40" radius="1" class="card">
                            <ActivityIndicator rowSpan="2" :busy="processing" color="white"></ActivityIndicator>
                            <StackLayout class="card">
                                <Label
                                    row="1"
                                    :text="c.id"
                                    horizontalAlignment="center"
                                    verticalAlignment="top"
                                    backgroundColor="black"
                                    width="100%"
                                    padding="10"
                                    fontSize="15"
                                    color="white"
                                ></Label>

                                <TextView  editable="false" backgroundColor="#565656">
                                    <Span :text="c.commentary" color="white" />
                                </TextView>
                            
                            </StackLayout>
                        </CardView>
                    </v-template>
                </ListView>
            </ScrollView>            

            <StackLayout row="2" orientation="horizontal" height="10%" horizontalAlign="center" >
            
                <Button textWrap="true" width="30%" text="Notas" class="btn-primary " @tap="$goto('notes')">
                    <FormattedString>

                        <Span text.decode="&#xf249;" class="fas" ></Span>                        

                    </FormattedString>
                </Button>

                <Button  textWrap="true" width="40%" class="btn-primary " @tap="$goto('camera')">
                    <FormattedString textWrap="true">
                        
                        <Span text.decode="&#xf030; " class="fas"></Span>

                    </FormattedString>
                            
                </Button>

                <Button textWrap="true" width="30%" text="Muestra" class="btn-primary " @tap="$goto('sample')">
                    <FormattedString>
                        
                        <Span text.decode="&#xf02a; " class="fas" ></Span>

                    </FormattedString>
                </Button>

            </StackLayout>
        </GridLayout>

    </Page>
</template>

<script>
    import * as http from "http";
    
    export default {

        data() {
            return {
                comments: [],

                show: [],

                processing: false,
            };
        },

        computed: {
            user() {
                return this.$store.state.session.email;
            }
        },

        methods: {

            loadComments() {
                //por implementar...
                //Carga los mensajes en la pantalla principal de la operación.
                console.log("carga los comentarios de la operación con id: " + this.$store.state.selectedOperation.id);

                this.comments = [];
                http.request({
                // Hay que sustituir la ip, obviamente
                url: "http://" + this.$store.state.ipAPI + 
                ":21021/api/services/app/Comments/GetCommentsByOperation?operationId="+this.$store.state.selectedOperation.id,
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

                            this.comments.push(result[i]);

                            //Aca tiene que obtener de alguna forma el usuario y la fecha del comentario:
/*
                            http.request({
                            url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/User/Get?Id="+result.C,
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                            }).then(response => {
                                var result = response.content.toJSON().result;
                                if (result == null) {
                                    console.log(result);
                                }
                                else {
                                    
                                        this.comments[i].name = result.userName;
                                    
                                }
                            }, error => {                                
                                console.error(error);
                                });
*/
                        }

                        this.processing=false;
                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                    });

            }
        },

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

    .fas {
        font-size : 40px;
    }

    .chat {
        margin : 20px;
        background-color: #1F1B24;

    }

    .title  {
        color: white;
        text-align:center;
        font-size: 25;
        border-color : white;
        
    }
</style>
