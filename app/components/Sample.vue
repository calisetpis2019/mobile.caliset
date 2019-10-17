<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar/>
        <ScrollView>
            <GridLayout rows="auto,auto,auto,*,auto,auto">

                <Label row="0" text="Agregar Muestra" class="subtitle" style="margin-bottom:50;"/>

                <GridLayout row="1" columns="auto,*">
                    <Label col="0"  text="Id muestra:" color="white" class="subtitle" />
                    <Label col="1" :text=idSample color="white" fontSize="20" class="card"/>
                </GridLayout>

                <FlexboxLayout row="2" flexDirection="column">
                    <TextView class="card text" hint="Agregar comentario a la muestra..." v-model="comment"/>
                </FlexboxLayout>

                <ActivityIndicator row="3" :busy="processing" color="white"></ActivityIndicator>
                <Label row="4" :text="successMsg" color="white" class="info" />

                <GridLayout row="5" columns="auto,*">
                    <Button col="0" :isEnabled="canAddSample" class="btn btn-primary" text="Agregar muestra" @tap="createSample()"/>
                    <Button col="1" :isEnabled="(idSample != '') && !canAddSample" class="btn btn-primary" text="Nueva muestra" @tap="newSample()"/>
                </GridLayout>

            </GridLayout>
        </ScrollView>

    </Page>
</template>

<script>
    import * as http from "http";
    
    export default {

        data() {
            return {
                comment: "",
                idSample: "",
                successMsg: "",
                processing: false,
                canAddSample: true
            }
        },

        computed: {
            user() {
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            }
        },

        methods: {

            createSample(){
                this.processing = true;
                this.canAddSample = false;
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
                    this.successMsg = "Se registró la muestra con éxito.";
                    var result = response.content.toJSON().result;
                    if (response.content.toJSON().success) {
                        console.log("Success. Se creó la muestra con éxito.");
                        this.idSample = result;
                    }
                    else {
                        console.log("Algo falló al crear la muestra.");
                    }
                }, error => {
                    this.processing = false;
                    console.error(error);
                    });
            },
            newSample(){
                console.log("Nueva muestra");
                this.idSample = "";
                this.comment = "";
                this.successMsg = "";
                this.canAddSample = true;
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
