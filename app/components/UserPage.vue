<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar userPage="true"/>

        <GridLayout rows="auto,auto,auto,*,auto" >
            <StackLayout row="0" >
                <Label :text=userEmail class="subtitle" textWrap="true" />
                <Label :text=lastLogin class="subtitle" textWrap="true" />
            </StackLayout>

            <FlexBoxLayout row="1" verticalAlignment="center" horizontalAlignment="center" >
                <Button class="btn btn-primary m-t-20" style="width: 40%" @tap="$goto('timeSheet')">
                    <FormattedString>
                        <Span text.decode="&#xf017;" class="fas" fontSize="30"/>
                        <Span text.decode="&#xa;&#xa;"/>
                        <Span text= "REGISTRAR HORAS" />
                    </FormattedString>
                </Button>
                <Button class="btn btn-primary m-t-20" style="width: 40%" @tap="$goto('timeRecord')">
                    <FormattedString>
                        <Span text.decode="&#xf017;" class="fas" fontSize="30"/>
                        <Span text.decode="&#xa;&#xa;"/>
                        <Span text= "VER REGISTROS DE HORAS" /> 
                    </FormattedString>
                </Button>
            </FlexBoxLayout>

            <Label row="2" text="" class="subtitle"/>


            <StackLayout row="3" verticalAlignment="bottom" horizontalAlignment="center" >
                <StackLayout class="hr-light"/>
                <StackLayout class="hr-dark"/>
                <StackLayout class="hr-light"/>
                <FlexboxLayout horizontalAlignment="center">
                    <Button text="Cambiar contraseña" @tap="changePassword" class="btn btn-changePass m-t-20" style="width:40%" margin="5" />
                    <Button text="Cerrar Sesión" @tap="logout" class="btn-reject m-t-20" style="width:40%" margin="5" />
                </FlexboxLayout>
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

    .subtitle {
        text-align: center;
    }


</style>
