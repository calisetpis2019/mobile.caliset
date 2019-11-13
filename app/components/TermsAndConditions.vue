<template>
    <Page class="page" actionBarHidden="true">
        <FlexboxLayout class="list-group" backgroundColor="#010812">
            <GridLayout rows="*,auto" columns="*,*" class="list-group">
                <Label row="0" colSpan="2" :text=termsAndConditions color="white" textWrap=true padding=40 />
                <Button row="1" col="0" text="Aceptar" class="btn btn-confirm m-t-20" @tap="accept"></Button>
                <Button row="1" col="1" text="Rechazar" class="btn btn-reject m-t-20" @tap="dismiss"></Button>
            </GridLayout>
        </FlexboxLayout>
    </Page>
</template>

<script>
    import * as http from "http";
    import * as ApplicationSettings from "application-settings";

    export default {

        data() {
            return {

            }
        },

        computed: {
            termsAndConditions() {
                return "Lorem ipsum dolor sit amet consectetur adipiscing elit porta fusce elementum magna proin, inceptos aliquam aenean in ultrices penatibus interdum sagittis netus ut. Pharetra tempor taciti nibh accumsan morbi fringilla mus blandit, pulvinar in egestas cubilia id quis nisi enim, rutrum non venenatis sociis vehicula eget sed. Metus nulla imperdiet commodo feugiat phasellus eu pretium, class sed fermentum etiam nunc tellus, eget taciti nec fames cum potenti. \n Leo aliquet maecenas torquent orci ultricies ullamcorper molestie interdum cum natoque, ornare at dictumst himenaeos netus nulla class egestas ridiculus rhoncus, dignissim porttitor nec mollis vehicula enim congue velit eleifend. Ante interdum nulla felis ornare euismod mus sed fames parturient erat viverra aptent blandit, quisque mi mauris bibendum facilisi cubilia nisl consequat fusce sociosqu tempus. Ullamcorper commodo vel cras mauris dictumst dignissim in dictum hac ante, eros cubilia integer quisque ultricies vivamus laoreet porta quis, viverra semper montes nibh habitant egestas lectus tristique suspendisse.";
            }
        },

        methods:{
            accept() {
                this.$goto('editPassword',{ clearHistory: true });
            },
            dismiss() {
                this.$store.commit('logout');
                this.$goto('login',{ clearHistory: true });
            }
        },


    };
</script>

<style scoped>

    .description-label {
        margin-bottom: 15;
    }

    .newOps {
        font-size: 10px;
    }

    .Ops {
        font-size: 10px;
    }

</style>
