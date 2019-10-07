<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadComments">
        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="auto,*,*" >
                <Image row="0" col="0" src="~/images/logo.png" class="action-image" stretch="aspectFit" height="140px" horizontalAlignment="left"></Image>
                <Button row="0" col="2" :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/>
            </GridLayout>
        </ActionBar>
        
        <GridLayout rows="auto,*,auto" >

            <StackLayout row="0" >
                <Label :text="'Operación '+ this.$store.state.selectedOperation.id" class="subtitle"/>
                <StackLayout horizontalAlign="center" orientation="horizontal" margin="10">
                    <Button textWrap="true" text="Asignaciones" class="btn-primary" width="50%" 
                            @tap="$goto('assignations')"/>
                    <Button textWrap="true" text="Informacion" class=" btn-primary" width="50%" 
                            @tap="$goto('information')"/>
                </StackLayout>
            </StackLayout>

            <ListView row="1" class="list-group" for="c in comments" separatorColor="#1F1B24" backgroundColor="gray">
                <v-template>
                    <CardView margin="10" elevation="40" radius="1" class="card">
                        <ActivityIndicator rowSpan="2" :busy="processing" color="white"></ActivityIndicator>
                        <StackLayout class="card">
                            <Label
                                :text="c.creatorUser.name+' '+c.creatorUser.surname"
                                backgroundColor="black"
                                width="100%"
                                fontSize="20"
                                color="white"
                            ></Label>

                            <TextView  editable="false" backgroundColor="#565656">
                                <Span :text="c.commentary" color="white" />
                            </TextView>

                            <Label :text="c.creationTime" fontSize="15" color="white" horizontalAlignment="right"/>
                        
                        </StackLayout>
                    </CardView>
                </v-template>
            </ListView>

            <StackLayout row="2" orientation="horizontal" height="10%" horizontalAlign="center" >
            
                <Button textWrap="true" width="30%" text="Notas" class="btn-primary " @tap="$goto('notes')">
                    <FormattedString>

                        <Span text.decode="&#xf249;" class="fas" ></Span>                        

                    </FormattedString>
                </Button>

                <!--<Button  textWrap="true" width="40%" class="btn-primary " @tap="$goto('camera')">-->
                <Button  textWrap="true" width="40%" class="btn-primary " @tap="takePicture">
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

    //Para utilizar la cámara:
    import * as camera from "nativescript-camera";
    import { Image } from "tns-core-modules/ui/image";

    
    export default {

        data() {
            return {
                comments: [],
                show: [],
                processing: false,
                nameOfPicture: "prueba_1.jpg",
                folder: "Camera/Prueba", // Acá va el directorio dentrio de DCIM en el que se quiere guardar las fotos
            };
        },

        computed: {
            user() {
                // return this.$store.state.session.email;
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            }
        },

        methods: {

            loadComments() {
                //por implementar...
                //Carga los mensajes en la pantalla principal de la operación.
                console.log("carga los comentarios de la operación con id: " + this.$store.state.selectedOperation.id);
                this.names = [];
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
                        this.processing=false;
                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                    });

            },

            takePicture() {

                //Creo el directorio donde se guardará la foto:
                var tempPicturePath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath();

                console.log(tempPicturePath);

                const fileSystemModule = require("tns-core-modules/file-system");

                const folderPath = fileSystemModule.path.join(tempPicturePath, this.folder);
                const folder = fileSystemModule.Folder.fromPath(folderPath);

                console.log(folderPath);

                //Defino las opciones con las que se guardará la imagen:
                var options = { width: 300, height: 300, keepAspectRatio: false, saveToGallery: false, nameOfPicture: this.nameOfPicture};

                //Modulo necesario para guardar la imagen:
                const imageSourceModule = require("tns-core-modules/image-source");

                //Utilizo la cámara para obtener la imagen:
                camera.requestPermissions()
                .then(() => {
                    camera.takePicture(options).
                    then((imageAsset) => {
                        console.log("Result is an image asset instance");
                        console.log("Size: " + imageAsset.options.width + "x" + imageAsset.options.height);
                        console.log("keepAspectRatio: " + imageAsset.options.keepAspectRatio);


                        const source = new imageSourceModule.ImageSource();
                        source.fromAsset(imageAsset)
                        .then((imageSource) => {
                            const filePath = fileSystemModule.path.join(folderPath, this.nameOfPicture);
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
