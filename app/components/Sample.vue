<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Muestra" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label :text=email horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>

        <GridLayout rows="auto,auto,*">

            <Label row="0" text="Tomar Muestra" class="subtitile" flexWrapBefore="true"/>

            <Label row="1" text="#DEF4930FCX90" color="white" flexWrapBefore="true"/>

            <FlexboxLayout row="2" flexDirection="column">
                <Label text="Comentario:" color="white" />
                <TextView class="card" padding="20" margin="40"/>    
            </FlexboxLayout>

            

        </GridLayout>
    </Page>
</template>

<script>
    export default {
        props: ['email','token'],

        data() {
            return {
              
            }
        },

        methods: {

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
