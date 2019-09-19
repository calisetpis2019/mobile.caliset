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

            <Label row="0" text="Nuevas Operaciones" class="subtitile" flexWrapBefore="true"/>

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
                            <StackLayout row="1" horizontalAlign="center" orientation="horizontal" margin="10">
                                <Button textWrap="true" text="Aceptar" class="btn-confirm" width="50%" />
                                <Button textWrap="true" text="Rechazar" class=" btn-reject" width="50%" />
                            </StackLayout>
                        </GridLayout>
                    </CardView>
                </v-template>
            </ListView>

        </GridLayout>
    </Page>
</template>

<script>
    export default {
        props: ['email','token','added'],

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
            showButtons() {
                console.log("btonbotontotnot");
                this.buttons = !this.buttons;
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
