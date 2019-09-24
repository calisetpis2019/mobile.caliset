<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Information" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/> 
            </GridLayout>
        </ActionBar>

        <GridLayout rows="auto,*">

            <Label row="0" text="Aca se muestra la informacion de la operación seleccionada" class="subtitle"       style="margin-bottom:50;"/>

            <GridLayout row="1" rows="*" columns="*,*">
                <Label row="0" column="0" text="info1: " color="white" horizontalAlignment="left" fontSize="20" />
                <Label row="0" column="1" rowtext="#DEF4930FCX90" color="white" horizontalAlignment = "center" fontSize="20" class="card"/>
            </GridLayout>

        </GridLayout>

    </Page>
</template>

<script>
    export default {
        // props: ['email','token'],

        data() {
            return {
                coment: "",
            }
        },

        computed: {
            user() {
                return this.$store.state.session.email;
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
