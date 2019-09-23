<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/> 
            </GridLayout>
        </ActionBar>
        
        <GridLayout rows="auto,*">

            <Label row="0" text="Asignaciones Operacion tal:" class="subtitle" flexWrapBefore="true"/>

            <Label row="1" text="Acá se listan las asignaciones de la operación seleccionada"
                    color="white" />

            <!--
                <ListView row="1" class="list-group" for="n in added" backgroundColor="#1F1B24" @itemTap="showButtons">
                    <v-template>
                        <CardView  margin="10" elevation="40" radius="1" class="card">
                            <GridLayout rows="*,auto" class="card">
                                <StackLayout row="0" class="container">
                                    <Label :text="n.name" class="list-group-item-heading"/>
                                    <Label :text="n.type" color="white"/>
                                    <Label :text="n.load"   color="white"  />
                                    <Label :text="n.client" color="white"  />
                                    <Label :text="n.date"   color="white"  />
                                </StackLayout >
                            </GridLayout>
                        </CardView>
                    </v-template>
                </ListView>
            -->

        </GridLayout>
    </Page>
</template>

<script>
    export default {

        data() {
            return {
                buttons: false
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
