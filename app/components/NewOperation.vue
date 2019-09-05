<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Operaciones" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label text="usuario" horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>
        
        <Label text="NUEVA OPERACION" />
    </Page>
</template>

<script>
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
