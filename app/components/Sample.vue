<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar/>
            <GridLayout rows="auto,auto,*,auto">
                <Label row="0" text="Agregar Muestra" class="subtitle" style="margin-bottom:50;"/>
                <ActivityIndicator row="1" :busy="processing" color="white"></ActivityIndicator>
                <FlexboxLayout row="2" flexDirection="column">
                    <TextView class="card text" hint="Agregar comentario a la muestra..." v-model="comment"/>
                </FlexboxLayout>
                <Button row="3" class="btn btn-primary" text="Agregar muestra" :isEnabled="!processing" @tap="createSample()"/>
            </GridLayout>
    </Page>
</template>

<script>
    import * as http from "http";
    
    export default {

        data() {
            return {
                comment: "",
                processing: false
            }
        },

        methods: {

            createSample(){

                if (getConnectionType() === connectionType.none) {
                    alert("No hay conexión a Internet...");
                    return;
                }
                
                this.processing = true;
                //Guarda comentario y borra el campo de texto
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Sample/Create",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+ this.$store.state.session.token
                    },
                    content: JSON.stringify({
                        "comment": this.comment,
                        "operationId": this.$store.state.selectedOperation.id
                    })
                }).then(response => {
                    this.processing = false;
                    if (response.content.toJSON().success) {
                        alert("Se registró la muestra con éxito.\nEl id de la muestra es: " + response.content.toJSON().result);
                        this.$goto('operation');
                    }
                    else {
                        alert("Algo falló al crear la muestra.");
                    }
                }, error => {
                    this.processing = false;
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
