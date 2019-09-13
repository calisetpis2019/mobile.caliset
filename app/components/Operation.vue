<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Operaciones" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label :text=email horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>

        <GridLayout rows="*,*,60">

            <StackLayout row="0">
                <Label text="operacion tal" color="white" />
                <Label :text="'fa-facebook-f' | fonticon" class="fa-brands" color="white"/>
                <Label :text="'fa-eye' | fonticon" class="far" color="white"/>
                <Label :text="'fa-eye' | fonticon" class="fas" color="white"/>
            </StackLayout>

            <ScrollView row="1">
                <!-- aca van los comentarios-->
                <WrapLayout orientation="horizontal">
                    <GridLayout for="c in comments" width="50%" height="150" backgroundColor="#B0C4DE"> <!--for="for c in comments" -->
                        <v-template>
                            <Label
                                row="1"
                                :text="c.name"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                backgroundColor="rgb(81,197,247, 0.8)"
                                width="100%"
                                padding="10"
                                fontSize="13"
                                color="black"
                            ></Label>
                        </v-template>
                        <!--<Label text="aca van los comentarios" color="white"/>-->
                    </GridLayout>
                </WrapLayout>
            </ScrollView>            

            <StackLayout row="2" orientation="horizontal">
            <!--<Label dock="bottom" text="OPERACION" color="white"/>-->
                <Button textWrap="true" width="20%" text="Notas">
                    <FormattedString>
                        <!--
                            <Span text="f249;\n" fontFamily="FontAwesome"></Span>
                            <Span text="Notas"></Span> 
                        -->
                        <Span :text="'fa-sticky-note' | fonticon" class="fas" ></Span>
                        <Span text="Notas"></Span>
                    </FormattedString>
                </Button>

                <Button  textWrap="true" width="30%" height="60"  @tap="$goto('camera',{
                            clearHistory: false,
                            props: {
                                email: email,
                                token: token,
                            }})">
                    <FormattedString>
                        <!--<Label :text="'fa-camera' | fonticon" class="fas" color="black"/>-->
                        <Span :text="'fa-camera' | fonticon" class="fas" ></Span>
                        <Span text="Camara"></Span>
                    </FormattedString>
                            
                </Button> <!-- @tap="$goto('home')" -->

                <Button textWrap="true" width="20%" text="Muestra">
                    <FormattedString>
                        <!--
                            <Label text="&#xf02a;\n" fontFamily="FontAwesome" />
                        -->
                        <Span :text="'fa-barcode' | fonticon" class="fas" ></Span>
                        <Span text="Muestra"></Span>
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
                        name: "Comentario 1",
                        text: "blab lablabkjalksdjfaslkj ballblablablab lab la bla bla bla lbakjslkfjawlekjfas"

                    },
                    {
                        name: "Comentario 2",
                        text: "hola!"
                    },
                    {
                        name: "Comentario 3",
                        text: "Chau!"
                    },
                    {
                        name: "Comentario 4",
                        text: "comentario comentario comentario"
                    },
                    {
                        name: "Comentario 5",
                        text: "Comentario generico"
                    },
                    {
                        name: "Comentario 6",
                        text: "Comentario generico"
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
        font-family: FontAwesome, fontawesome-webfont;
    }

    .info {
        font-size: 20;
    }


</style>
