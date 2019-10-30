<template>
    <Page class="page" backgroundColor="#1F1B24" >
        <OurActionBar/>
        <ScrollView>
            <Pickers title="REGISTRAR HORAS" type="register" />
        </ScrollView>
    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {
            return {
            };
        },

        computed: {
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

    .fas {
        font-size : 40px;
    }

    .chat {
        margin : 20px;
        background-color: #1F1B24;

    }

    .title  {
        color: white;
        text-align:center;
        font-size: 25;
        border-color : white;
        
    }

    .subtitle {
        font-size: 15px;
        font-weight: bold;
    }
</style>
