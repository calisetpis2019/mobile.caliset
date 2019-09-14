<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Operaciones" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label :text=email horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>

        <StackLayout>
          
        <Label text="OPERACION" color="white"/>
        <Button text="Add photos" class="btn btn-primary m-t-20" @tap="$goto('camera',{
                    clearHistory: false,
                    props: {
                        email: email,
                        token: token,
                    }})"></Button> 
        </StackLayout>
    </Page>
</template>

<script>
    export default {
        props: ['email','token'],

        computed: {
            message() {
                return "Blank {N}-Vue app";
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
