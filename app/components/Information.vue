<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar/>
        <GridLayout rows="auto,*">
            <Label row="0" :text="'Operación '+ operation.id" class="subtitle" style="margin-bottom:50;"/>

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
