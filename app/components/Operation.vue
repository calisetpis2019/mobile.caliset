<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadComments">
        <OurActionBar/>
        
        <GridLayout rows="auto,*,auto" >

            <StackLayout row="0" >
                <Label :text="'Operación '+ this.$store.state.selectedOperation.id + '-' + formatDate(this.$store.state.selectedOperation.date)" class="subtitle"/>
                <StackLayout horizontalAlign="center" orientation="horizontal" margin="10">
                    <Button textWrap="true" text="Asignaciones" class="btn-primary" width="50%" 
                            @tap="$goto('assignations')"/>
                    <Button textWrap="true" text="Información" class=" btn-primary" width="50%" 
                            @tap="$goto('information')"/>
                </StackLayout>
            </StackLayout>
            <PullToRefresh row="1" @refresh="refreshList" >
                <ListView class="list-group" for="c in comments" separatorColor="#1F1B24" backgroundColor="gray">
                    <v-template>
                        <CardView margin="10" elevation="40" radius="1" class="card" :key="componentKey" >
                            <StackLayout class="card"  >
                                <Label @tap="editNote(c)"
                                    :text="c.creatorUser.name+' '+c.creatorUser.surname"
                                    backgroundColor="black"
                                    width="100%"
                                    fontSize="20"
                                    color="white"
                                ></Label>
                                <TextView  editable="false" backgroundColor="#565656" @tap="editNote(c)" >
                                    <FormattedString>
                                        <Span :text="c.commentary" color="white" />
                                    </FormattedString>
                                </TextView>

                                <Label :text="formatDateHour(c.creationTime)" fontSize="15" color="white" horizontalAlignment="right" @tap="editNote(c)"/>
                            </StackLayout>
                        </CardView>
                    </v-template>
                </ListView>
            </PullToRefresh>
            <ActivityIndicator rowSpan="2" :busy="processing" color="white"></ActivityIndicator>

            <StackLayout row="2" orientation="horizontal" height="15%" horizontalAlign="center" 
                            :visibility="isOperationFuture() ? 'collapsed' : 'visible' " >
            
                <Button textWrap="true" width="30%" text="Notas" class="btn-primary " @tap="$goto('notes')" >
                    <FormattedString>
                        <Span text.decode="&#xf249;" class="fas" />                        
                    </FormattedString>
                </Button>

                <Button textWrap="true" width="40%" class="btn-primary" @tap="takePicture" >
                    <FormattedString textWrap="true">
                        <Span text.decode="&#xf030;" class="fas" />
                    </FormattedString>
                </Button>

                <Button textWrap="true" width="30%" text="Muestra" class="btn-primary " @tap="$goto('sample')" >
                    <FormattedString>
                        <Span text.decode="&#xf02a;" class="fas" />
                    </FormattedString>
                </Button>

            </StackLayout>
        </GridLayout>

    </Page>
</template>

<script>
    import * as http from "http";

    //Para utilizar la cámara:
    import * as camera from "nativescript-camera";
    import { Image } from "tns-core-modules/ui/image";

    //Pantalla para editar comentario
    import EditNote from "./EditNote";

    
    export default {

        data() {
            return {
                componentKey: 0,
                comments: [],
                processing: false,
                nameOfPicture: "Operacion" + this.$store.state.selectedOperation.id + "_",
                folder: "Camera", // Acá va el directorio dentrio de DCIM en el que se quiere guardar las fotos
                idFuture: 1, //Hardcodeado
                isFuture: false,
            };
        },

        methods: {
            isOperationFuture() {
                var isFuture = (this.$store.state.selectedOperation.operationState.id == this.idFuture)
                return isFuture;
            },
            
            refreshList(args) {
                var pullRefresh = args.object;
                this.loadComments();
                setTimeout(function() {
                    pullRefresh.refreshing = false;
                }, 1000);
            },
            
            formatDateHour(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            },

            createDateTimeStamp() {
                var result = "";
                var date = new Date();
                result = date.getFullYear().toString() +
                    ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) +
                    (date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString()) + "_" +
                    date.getHours().toString() +
                    date.getMinutes().toString() +
                    date.getSeconds().toString();
                return result;
            },

            loadComments() {
                //Carga los mensajes en la pantalla principal de la operación.
                console.log("carga los comentarios de la operación con id: " + this.$store.state.selectedOperation.id);
                this.comments = [];
                http.request({
                // Hay que sustituir la ip, obviamente
                url: "http://" + this.$store.state.ipAPI + 
                ":21021/api/services/app/Comments/GetCommentsByOperation?operationId="+this.$store.state.selectedOperation.id,
                method: "GET",
                headers: { 
                        "Content-Type": "application/json",
                        "Authorization":"Bearer "+ this.$store.state.session.token,
                    },
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
                        }
                        this.componentKey+=1;
                        this.comments.sort(function(a,b){
                            let x = new Date(a.creationTime);
                            let y = new Date(b.creationTime);
                            return y-x;
                        });
                        this.processing=false;
                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                    });

            },

            takePicture() {
                var timeStamp = this.createDateTimeStamp();

                //Creo el directorio donde se guardará la foto:
                var tempPicturePath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath();

                const fileSystemModule = require("tns-core-modules/file-system");

                //Defino las opciones con las que se guardará la imagen:
                var options = {keepAspectRatio: true, saveToGallery: false, nameOfPicture: this.nameOfPicture};
                // var options = { width: 300, height: 300, keepAspectRatio: true, nameOfPicture: this.nameOfPicture};

                //Modulo necesario para guardar la imagen:
                const imageSourceModule = require("tns-core-modules/image-source");
                //Utilizo la cámara para obtener la imagen:
                camera.requestPermissions()
                .then(() => {
                    camera.takePicture(options).
                    then((imageAsset) => {
                        const folderPath = fileSystemModule.path.join(tempPicturePath, this.folder);
                        const folder = fileSystemModule.Folder.fromPath(folderPath);

                        console.log(folderPath);
                        console.log("Result is an image asset instance");
                        console.log("Size: " + imageAsset.options.width + "x" + imageAsset.options.height);
                        console.log("keepAspectRatio: " + imageAsset.options.keepAspectRatio);


                        const source = new imageSourceModule.ImageSource();
                        source.fromAsset(imageAsset)
                        .then((imageSource) => {
                            const filePath = fileSystemModule.path.join(folderPath, this.nameOfPicture + timeStamp + ".jpg");
                            const saved = imageSource.saveToFile(filePath, "jpg");
                            if (saved) {
                                console.log("Saved: " + filePath);
                                console.log("Image saved successfully!");
                            }
                        }).catch((err) => {
                            console.log("Error -> " + err.message);
                        });
                    }).catch((err) => {
                        console.log("Error -> " + err.message);
                    });
                }).catch((err) => {
                    console.log("Error -> " + err.message);
                });
            },

            editNote(comment) {

                console.log("Comentario seleccionado para edición: ");
                console.log(comment.id + ' - ' + comment.commentary);

                if (comment.creatorUser.id == this.$store.state.session.userId){
                    this.$store.commit('selectedComment',{ selectedComment: comment});
                    this.$showModal(EditNote, { fullscreen: false }).then(data => this.loadComments());
                }
                
            },

        },//termina methods

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
