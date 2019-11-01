<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar userPage="true"/>

        <GridLayout rows="auto,auto,auto,*,auto" >
            <StackLayout row="0" >
                <Label :text=userEmail class="subtitle" textWrap="true" />
                <Label :text=lastLogin class="subtitle" textWrap="true" />
            </StackLayout>

            <FlexBoxLayout row="1" verticalAlignment="center" horizontalAlignment="right" >
                <Button class="btn btn-primary m-t-20" @tap="$goto('timeSheet')" background="black">
                    <FormattedString>
                        <Span text.decode="&#xf067; &#xf017;" class="fas" fontSize="30" />
                        <Span text.decode="Agregar registro" class="fas" />
                    </FormattedString>
                </Button>
            </FlexBoxLayout>

            <!-- <ListView class="list-group" for="record in hoursRecords">
                <v-template>
                    <CardView  margin="10" elevation="40" radius="1" class="card">
                        <StackLayout class="card" @tap=";">
                            <Label :text="'Operación '+ future.id + '-' + formatDate(future.date)" class="list-group-item-heading"/>
                            <StackLayout class="container">
                                <Label :text="'Producto: ' + future.commodity" color="white"/>
                                <Label :text="'Fecha: ' + formatDateHour(future.date)" color="white"  />
                                <Label :text="'Lugar: ' + future.location.name" color="white"  />
                                <Label :text="'Estado: ' + future.operationState.name"   color="white"  />
                            </StackLayout>
                        </StackLayout>
                    </CardView>
                </v-template>
            </ListView> -->


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
