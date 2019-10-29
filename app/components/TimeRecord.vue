<template>
    <Page class="page" backgroundColor="#1F1B24">
        <OurActionBar/>
        <Pickers title="taimrecordddds" type="view" />

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


</style>
