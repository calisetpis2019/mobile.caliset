<template>
    <Page class="page" backgroundColor="#1F1B24">

        <!-- <ActionBar title="Notes" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/> 
            </GridLayout>
        </ActionBar> -->
        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="auto,*,*" >
                <Image row="0" col="0" src="~/images/logo.png" class="action-image" stretch="aspectFit" height="140px" horizontalAlignment="left"></Image>
                <Button row="0" col="2" :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/>
            </GridLayout>
        </ActionBar>
        
        <GridLayout rows="auto,*,auto">

            <Label row="0" text="Escribir Nota" class="subtitle" flexWrapBefore="true"/>
            
            <FlexboxLayout row="1" flexDirection="column">
                
                <TextView class="card text" hint="Escribir nota..." v-model="note"/>
                
            </FlexboxLayout>
            
            <Button row="2" class="btn btn-primary" text="Guardar" @tap="saveNote()"/>
            

        </GridLayout>
    </Page>
</template>

<script>
    export default {
        props: ['email','token'],

        data() {
            return {
                note: "",
            }
        },
        
        computed: {
            user() {
                // return this.$store.state.session.email;
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            }
        },

        methods: {

            saveNote(){
                //Envía el comentario al servidor y borra el texto.
                this.note = "";
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
