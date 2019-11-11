<template>
    <Page class="page" >
        <OurActionBar/>
        <GridLayout rows="auto,auto,*">
            <Label row="0" text="INFORMACIÓN" class="subtitle" flexWrapBefore="true" textWrap="true" />
            <Label row="1" :text="'Operación '+ operation.id + '-' + formatDate(operation.date)" class="subtitle" textWrap="true" />

            <ScrollView row="2">

                <GridLayout rows="*,*,*,*,*,*,*,*,*,*,*,*">

                    <StackLayout row="0">
                        <Label  text="Fecha:" color="white" fontSize="20" class="subtitle" />
                        <Label :text="formatDateHour(operation.date)" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="1">
                        <Label text="Estado:" color="white" fontSize="20" class="subtitle" />
                        <Label :text="operation.operationState.name" color="white" fontSize="20" class="info" />
                    </StackLayout>
                    
                    <StackLayout row="2">
                        <Label text="Tipo: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.operationType.name" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="3">
                        <Label text="Producto: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.commodity" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="4">
                        <Label text="Paquete: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.package" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="5">
                        <Label text="Embarcación: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.shipName" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="6">
                        <Label text="Destino: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.destiny" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="7">
                        <Label text="Línea: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.line" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="8">
                        <Label text="Booking: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.bookingNumber" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="9">
                        <Label text="Nominador: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.nominator.name" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="10">
                        <Label text="Cargador: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.charger.name" color="white" fontSize="20" class="info" />
                    </StackLayout>

                    <StackLayout row="11">
                        <Label text="Responsable: " color="white" fontSize="20" class="subtitle"/>
                        <Label :text="operation.manager.name + ' ' + operation.manager.surname" color="white" fontSize="20" class="info" />
                    </StackLayout>
                    
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

        methods: {
            formatDateHour(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            },
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
        margin-top: 10px;
    }


</style>
