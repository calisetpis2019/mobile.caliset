<template>
    <Page class="page" backgroundColor="#1F1B24">

        <!-- <ActionBar title="Information" class="action-bar" backgroundColor="#1F1B24" >
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

        <GridLayout rows="auto,*">
            <Label row="0" :text="'Operación '+ operation.id" class="info" style="margin-bottom:50;"/>

            <ScrollView row="1">

                <GridLayout rows="*,*,*,*,*,*,*,*,*,*,*,*" columns="">

                    <Label :row="i" column="0" text="Fecha: " color="white" horizontalAlignment="left" fontSize="20"/>
                    <Label :row="i++" column="1" :text="operation.date" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Estado: " color="white" fontSize="20"/>
                    <Label :row="i++"  column="1" :text="operation.operationState.name" color="white" fontSize="20" horizontalAlignment = "right" />

                    <Label :row="i" column="0" text="Commodity: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++" column="1" :text="operation.commodity" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Paquete: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++"  column="1" :text="operation.package" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Embarcación: " color="white" horizontalAlignment="left" fontSize="20"/>
                    <Label :row="i++" column="1" :text="operation.shipName" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Destino: " color="white" fontSize="20"/>
                    <Label :row="i++" column="1" :text="operation.destiny" color="white" fontSize="20" horizontalAlignment = "right" />

                    <Label :row="i" column="0" text="Línea: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++" column="1" :text="operation.line" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Booking: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++" column="1" :text="operation.bookingNumber" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Tipo: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++" column="1" :text="operation.operationType.name" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Nominador: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++" column="1" :text="operation.nominator.name" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Cargador: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++" column="1" :text="operation.charger.name" color="white" horizontalAlignment = "right" fontSize="20"/>

                    <Label :row="i" column="0" text="Responsable: " color="white" horizontalAlignment="left" fontSize="20" />
                    <Label :row="i++" column="1" :text="operation.manager.name + ' ' + operation.manager.surname" color="white" horizontalAlignment = "right" fontSize="20"/>



                </GridLayout>

            </ScrollView>
        </GridLayout>

    </Page>
</template>

<script>
    export default {

        data() {
            return {
                operation : this.$store.state.selectedOperation,
                i: 0,

            }
        },

        computed: {
            user() {
                // return this.$store.state.session.email;
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
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
