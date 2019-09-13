<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Operaciones" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label :text=email horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>

        <GridLayout rows="30,3*,100" >

            <StackLayout row="0"  horizontalAlign="center">
                <Label text="operacion tal" color="white" horizontalAlign="center" />
            </StackLayout>

            <ScrollView row="1" class="chat">
                <!-- aca van los comentarios-->
                <!--<WrapLayout orientation="horizontal">-->
                <ListView class="list-group" for="c in comments" backgroundColor="#B0C4DE" separatorColor="white"> <!--for="for c in comments" -->
                    <v-template>
                        <StackLayout class="card">
                            <Label
                                row="1"
                                :text="c.name"
                                horizontalAlignment="center"
                                verticalAlignment="top"
                                backgroundColor="rgb(81,197,247, 0.8)"
                                width="100%"
                                padding="10"
                                fontSize="13"
                                color="black"
                            ></Label>

                            <TextView  editable="false">
                                <Span :text="c.text" color="black" />
                            </TextView>
                        
                        </StackLayout>
                    </v-template>
                    <!--<Label text="aca van los comentarios" color="white"/>-->
                </ListView>
                <!--</WrapLayout>-->
            </ScrollView>            

            <StackLayout row="2" orientation="horizontal" horizontalAlign="center" >
            <!--<Label dock="bottom" text="OPERACION" color="white"/>-->
                <Button textWrap="true" width="30%" text="Notas">
                    <FormattedString>
                        <!--
                            <Span text="f249;\n" fontFamily="FontAwesome"></Span>
                            <Span text="Notas"></Span> 
                        -->
                        <Span :text="'fa-sticky-note' | fonticon" class="fas" ></Span>

                    </FormattedString>
                </Button>

                <Button  textWrap="true" width="40%" @tap="$goto('camera',{
                            clearHistory: false,
                            props: {
                                email: email,
                                token: token,
                            }})">
                    <FormattedString textWrap="true">
                        
                        <Span :text="'fa-camera' | fonticon" class="fas"></Span>

                    </FormattedString>
                            
                </Button> <!-- @tap="$goto('home')" -->

                <Button textWrap="true" width="30%" text="Muestra">
                    <FormattedString>
                        <!--
                            <Label text="&#xf02a;\n" fontFamily="FontAwesome" />
                        -->
                        <Span :text="'fa-barcode' | fonticon" class="fas" ></Span>

                    </FormattedString>
                </Button>

            </StackLayout>
        </GridLayout>

    </Page>
</template>

<script>
    
    export default {
        props: ['email','token'],

        data() {
            return {
                comments: [{
                        name: "Juan Carlos",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

                    },
                    {
                        name: "Comentario 2"
                    },
                    {
                        name: "Comentario 3"
                    },
                    {
                        name: "Comentario 4"
                    },
                    {
                        name: "Comentario 5"

                    },
                    {
                        name: "Comentario 6"

                    }
                ],
            };
        },

        computed: {
            message() {
                return "Blank {N}-Vue app";
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

    .fas {
        font-size : 40px;
    }

    .chat {
        margin : 20px;

    }
</style>
