<template>
    <Page class="page" backgroundColor="#1F1B24">
        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="auto,*,*" >
                <Image row="0" col="0" src="~/images/logo.png" class="action-image" stretch="aspectFit" height="140px" horizontalAlignment="left"></Image>
                <Button row="0" col="2" :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" isEnabled=false />
            </GridLayout>
        </ActionBar>

        <GridLayout rows="auto,auto,*,auto">
            <StackLayout row="0" verticalAlignment="left" >
                <Label :text=userEmail class="info" />
                <Label :text=lastLogin class="info" />
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
            user() {
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            },
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
