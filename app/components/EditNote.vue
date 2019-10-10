<template>
    
    <GridLayout rows="auto,auto,*,auto">

        <Label row="0" text="Escribir comentario" class="subtitle" flexWrapBefore="true"/>

        <ActivityIndicator row="1" :busy="processing" color="white" />
        
        <FlexboxLayout row="2" flexDirection="column">
            
            <TextView class="card text" hint="Escribir comentario..." v-model="comment" />
            
        </FlexboxLayout>
        
        <StackLayout row="3">
            <Button class="btn btn-primary" text="Agregar comentario" @tap="saveNote()" />
            <Button class="btn-reject" text="cancelar" @tap="$modal.close()" />
        </StackLayout>

    </GridLayout>

</template>

<script>
    import * as http from "http";

    export default {

        data() {
            return {
                comment: this.$store.state.selectedComment.commentary,
                processing: false,
            }
        },
        
        methods: {
            saveNote(){
                this.processing=true;
                //Envía el comentario modificado al servidor.
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Comments/Update",
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token
                    },
                    content: JSON.stringify({
                        "commentary": this.comment,
                        "id": this.$store.state.selectedComment.id
                    })
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (response.content.toJSON().success) {
                        this.processing=false;
                        console.log("Comentario editado con éxito.");
                        this.$modal.close();
                    }
                    else {
                        processing=false;
                        console.log("Ocurrió un error al editar el comentario.")
                    }
                }, error => {
                    this.processing=false;
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
