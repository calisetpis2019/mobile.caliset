<template>
    <Page class="page" backgroundColor="#1F1B24">
        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="auto,*,*" >
                <Image row="0" col="0" src="~/images/logo.png" class="action-image" stretch="aspectFit" height="140px" horizontalAlignment="left"></Image>
                <Button row="0" col="2" :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/>
            </GridLayout>
        </ActionBar>
        
        <GridLayout rows="auto,auto,*,auto">

            <Label row="0" text="Escribir comentario" class="subtitle" flexWrapBefore="true"/>

            <ActivityIndicator row="1" :busy="processing" color="white" />
            
            <FlexboxLayout row="2" flexDirection="column">
                
                <TextView class="card text" hint="Escribir comentario..." v-model="comment" />
                
            </FlexboxLayout>
            
            <Button row="3" class="btn btn-primary" text="Agregar comentario" @tap="saveNote()" />
            

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
        
        computed: {
            user() {
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            }
        },

        methods: {
            saveNote(){
                this.processing = true;
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
