<template>
	<ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
        <GridLayout rows="auto" columns="auto,*,auto" >
            <Image row="0" col="0" src="~/images/logo.png" class="action-image" stretch="aspectFit" 
                    height="50" horizontalAlignment="left" @tap="$goto('home',{ clearHistory: true })"></Image>
            <Button row="0" col="2" :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
            @tap="$goto('userPage')" :isEnabled="!userPage" textWrap="true"/>
        </GridLayout>
    </ActionBar>
</template>


<script>
    export default {
        props: ["userPage"],

        computed: {
            user() {
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
            }
        },

    }

</script>