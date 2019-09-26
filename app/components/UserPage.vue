<template>
    <Page class="page" backgroundColor="#1F1B24">

        <!-- <ActionBar title="UserPage" class="action-bar" backgroundColor="#1F1B24" >
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

        <GridLayout rows="auto,auto,*,auto">
            <StackLayout row="0" verticalAlignment="left" >
                <Label text="aca iria la info del usuario logueado" class="text" />
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
            <StackLayout row="2" />
            <StackLayout row="3" verticalAlignment="bottom" horizontalAlignment="center" >
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
