<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar userPage="true"/>

        <GridLayout rows="auto,auto,*,auto">
            <StackLayout row="0" margin="20px">
                <Label :text=userEmail class="info" textWrap="true" horizontalAlignment="left" />
                <Label :text=lastLogin class="info" textWrap="true" horizontalAlignment="left" />
            </StackLayout>

            <StackLayout row="1" verticalAlignment="center" >
                <Button class="btn btn-primary m-t-20" style="width: 25%" @tap="$goto('timeSheet')">

                    <FormattedString>
                        <Span text.decode="&#xf017;" class="fas" fontSize="30"/>
                        <Span text.decode="&#xa;&#xa;"/>
                        <Span text= "REGISTRO DE HORAS" /> 
                    </FormattedString>
                </Button>
            </StackLayout>

            <StackLayout row="2" horizontalAlignement="center">
                <Button text="Cambiar contraseña" @tap="changePassword" class="btn-primary m-t-20" style="width:80%" textWrap="true" />
            </StackLayout>

            <StackLayout row="3" verticalAlignment="bottom" horizontalAlignment="center" >
                <Button text="Cerrar Sesión" @tap="logout" class="btn-reject m-t-20" style="width:40%" />
            </StackLayout>
        </GridLayout>

    </Page>
</template>

<script>
    export default {

        data() {
            return {
                
            }
        },

        computed: {
            userEmail() {
                return "Correo electrónico: " + this.$store.state.session.email;
            },
            lastLogin() {
                return "Último inicio de sesión: " +
                this.$store.state.session.date.day + "/" +
                this.$store.state.session.date.month + "/" +
                this.$store.state.session.date.year;
            }
        },

        methods: {
            logout() {
                this.$store.commit('logout');
                this.$goto('login',{ clearHistory: true });
            },

            changePassword() {
                this.$goto('editPassword');
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
