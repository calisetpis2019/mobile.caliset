<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=email horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage',{
                    clearHistory: false,
                    props: {
                        email: email,
                        token: token,
                    }})"/> 
            </GridLayout>
        </ActionBar>

        <GridLayout rows="auto, *, auto, auto">
            <StackLayout row="0" orientation="vertical" padding="5">
                <StackLayout orientation="horizontal" row="0" padding="5">
                    <Label text="saveToGallery" color="white" />
                    <Switch v-model="saveToGallery"/>
                </StackLayout>
                <StackLayout android:visibility="collapsed" orientation="horizontal" row="0" padding="5">
                    <Label text="allowsEditing" color="white" />
                    <Switch v-model="allowsEditing"/>
                </StackLayout>
                <StackLayout orientation="horizontal" row="0" padding="5">
                    <Label text="keepAspectRatio" color="white" />
                    <Switch v-model="keepAspectRatio"/>
                </StackLayout>
                <StackLayout orientation="horizontal" padding="5">
                    <Label text="width" color="white"></Label>
                    <TextField hint="Enter width" keyboardType="number" v-model="width" class="input"></TextField>
                    <Label text="height" color="white"></Label>
                    <TextField hint="Enter height" keyboardType="number" v-model="height" class="input"></TextField>
                </StackLayout>
                <StackLayout>
                    <TextField hint="Enter nameofpicture" keyboardType="number" v-model="nameOfPicture" class="input" color="white"></TextField> 
                </StackLayout>
            </StackLayout>
            <Image row="1" :src="cameraImage" id="image" stretch="aspectFit" margin="10"/>
            <TextView row="2" :text="labelText" editable="false"></TextView>>
            <Button row="3"  text="Take Picture" @tap="onTakePictureTap"  padding="10"/>
        </GridLayout>
    </Page>
</template>

<script>
    import { EventData, Observable, fromObject } from "tns-core-modules/data/observable";
    import { Page } from "tns-core-modules/ui/page";
    import { View } from 'tns-core-modules/ui/core/view';
    import { takePicture, requestPermissions } from "nativescript-camera";
    export default {
        data() {
            return {
                saveToGallery: true,
                allowsEditing: false,
                keepAspectRatio: true,
                width: 320,
                height: 240,
                cameraImage: null,
                labelText: "",
                nameOfPicture: ""
            }
        },
        methods: {
            onTakePictureTap: function(args) {
                let page = (args.object).page;
                let that = this;
                requestPermissions().then(
                    () => {
                        takePicture({ width: that.width, height: that.height, keepAspectRatio: that.keepAspectRatio, saveToGallery: that.saveToGallery, allowsEditing: that.allowsEditing , nameOfPicture: that.nameOfPicture}).
                            then((imageAsset) => {
                                that.cameraImage = imageAsset;
                                imageAsset.getImageAsync(function (nativeImage) {
                                    let scale = 1;
                                    let actualWidth = 0;
                                    let actualHeight = 0;
                                    if (imageAsset.android) {
                                        // get the current density of the screen (dpi) and divide it by the default one to get the scale
                                        scale = nativeImage.getDensity() / android.util.DisplayMetrics.DENSITY_DEFAULT;
                                        actualWidth = nativeImage.getWidth();
                                        actualHeight = nativeImage.getHeight();
                                    } else {
                                        scale = nativeImage.scale;
                                        actualWidth = nativeImage.size.width * scale;
                                        actualHeight = nativeImage.size.height * scale;
                                    }
                                    that.labelText = `Displayed Size: ${actualWidth}x${actualHeight} with scale ${scale}\n` +
                                        `Image Size: ${Math.round(actualWidth / scale)}x${Math.round(actualHeight / scale)}`;
                                    console.log(`${labelText}`);
                                });
                            },
                            (err) => {
                                console.log("Error -> " + err.message);
                            });
                    },
                    () => alert('permissions rejected')
                );
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
