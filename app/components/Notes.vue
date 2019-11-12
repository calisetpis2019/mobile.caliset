<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar/>
        
        <GridLayout rows="auto,auto,*,auto">

            <Label row="0" text="ESCRIBIR COMENTARIO" class="subtitle" flexWrapBefore="true"/>

            <ActivityIndicator row="1" :busy="processing" color="white" />
            
            <FlexboxLayout row="2" flexDirection="column">
                
                <TextView class="card text" hint="Escribir comentario..." v-model="comment" />
                
            </FlexboxLayout>
            
            <Button row="3" class="btn btn-primary" text="Agregar comentario" @tap="saveNote()" :isEnabled='comment !== ""'/>
            

        </GridLayout>
    </Page>
</template>

<script>
    import * as http from "http";
    import { connectionType, getConnectionType } from 'tns-core-modules/connectivity';

    export default {

        data() {
            return {
                comment: "",
                processing: false
            }
        },
        
        methods: {
            saveNote(){
                this.processing = true;

                if (getConnectionType() === connectionType.none) {
                    alert("No hay conexión a Internet, se guarda el mensaje para enviarse luego");
                    this.$store.commit('saveNote', {    operationId : this.$store.state.selectedOperation.id,
                                                        comment: this.comment });
                    this.$goto('operation');
                    return;
                }
                //Envía el comentario al servidor y borra el texto.
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Comments/Create",
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token
                    },
                    content: JSON.stringify({
                        "commentary": this.comment,
                        "operationId": this.$store.state.selectedOperation.id
                    })
                }).then(response => {
                    this.processing = false;
                    var result = response.content.toJSON().result;
                    if (response.content.toJSON().success) {
                        console.log("Comentario agregado con éxito.");
                        this.comment = "";
                        alert("El comentario se agregó con éxito.");
                        this.$goto('operation');
                    }
                    else {
                        console.log("Ocurrió un error al agregar el comentario.")
                    }
                }, error => {
                    this.errorMsg = "Falló la conexión. Por favor intente luego.";
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
