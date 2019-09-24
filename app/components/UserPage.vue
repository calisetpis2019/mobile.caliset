<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Muestra" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/>
            </GridLayout>
        </ActionBar>

        <GridLayout rows="auto,auto,*,auto">
            <StackLayout row="0" verticalAlignment="left" >
                <Label text="aca iria la info del usuario logueado" class="text" />
            </StackLayout>

            <StackLayout row="1" verticalAlignment="center" >
                <Button text="REGISTRO DE HORAS" @tap="$goto('timeSheet',{
                        clearHistory: false,
                        props: {
                            operations: operations,
                        }})" class="btn btn-primary m-t-20" style="width:25%" />
            </StackLayout>
            <StackLayout row="2" />
            <StackLayout row="3" verticalAlignment="bottom" horizontalAlignment="left" >
                <Button text="Cerrar Sesión" @tap="logout" class="btn-reject m-t-20" style="width:25%" />
            </StackLayout>
        </GridLayout>

    </Page>
</template>

<script>
    export default {
        // props: ['email','token'],

        data() {
            return {
                
            }
        },

        computed: {
            user() {
                return this.$store.state.session.email;
            }
        },

        methods: {
            logout() {
                this.$store.commit('logout');
                this.$goto('login',{ clearHistory: true });
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
