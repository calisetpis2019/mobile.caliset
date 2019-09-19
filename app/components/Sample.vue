<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Muestra" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label :text=user horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>

        <GridLayout rows="auto,auto,*,auto">

            <Label row="0" text="Tomar Muestra" class="subtitile" style="margin-bottom:50;"/>

            <StackLayout row="1">
                <Label text="Etiqueta: " color="white" horizontalAlignment="left" fontSize="20" />
                <Label text="#DEF4930FCX90" color="white" horizontalAlignment = "center" fontSize="20" class="card"/>
            </StackLayout>

            <FlexboxLayout row="2" flexDirection="column">
                <TextView class="card text" hint="Escribir comentario..." v-model="coment"/>
            </FlexboxLayout>

            <Button row="3" class="btn btn-primary" text="Guardar" @tap="saveComent()"/>


        </GridLayout>

    </Page>
</template>

<script>
    export default {
        props: ['email','token'],

        data() {
            return {
                coment: "",
            }
        },

        computed: {
            user() {
                return this.$store.state.session.email;
            }
        },

        methods: {

            saveComent(){
                //Guarda comentario y borra el campo de texto
                this.coment = "";
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
