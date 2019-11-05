<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadHours">
        <OurActionBar userPage="true"/>

        <GridLayout rows="auto,,auto,*,auto" >

            <GridLayout row="0" rows="auto,auto" columns="*,auto" >
                <Label rowSpan="2" colSpan="2" class="subtitle" />
                <Label row="0" colSpan="0" :text=userEmail class="subtitle" textWrap="true" />
                <Label row="1" col="0" :text=lastLogin class="subtitle" textWrap="true" />
                <Button col="1" rowSpan="2" class="btn btn-primary m-t-20" @tap="$goto('timeSheet')" background="black">
                    <FormattedString>
                        <Span text.decode="&#xf067; &#xf017;" class="fas subtitle" fontSize="30" />
                    </FormattedString>
                </Button>
            </GridLayout>
            <Label row="1" :visibility="hourRecords.length == 0 ? 'visible' : 'collapsed'"
                    text="No hay registros de horas para mostrar." textWrap="true" class="info"
                    style="margin-top: 20" />

            <PullToRefresh row="2" @refresh="refreshLists" >
                <ListView class="list-group" for="record in hourRecords">
                    <v-template>
                        <CardView  margin="10" elevation="40" radius="1" class="card">
                            <StackLayout class="card" @tap=";">
                                <Label :text="record.day" class="list-group-item-heading"/>
                                <StackLayout class="card" v-for="r in record.list" @tap=";">
                                <GridLayout rows="auto,auto,auto" columns="*,auto,auto" >
                                    <Label row="0" col="0" :text="formatDateHour(r.startDate)" color="white" />
                                    <Label row="1" col="0" :text="formatDateHour(r.endDate)" color="white" />
                                    <label row="2" col="0" :text="'Total: ' + countHours(r.startDate,r.endDate) + ' hs.'" textWrap="true"/>
                                    <Button row="0" rowSpan="2" col="1" text.decode="&#xf044;" @tap="editTimeRecord()" class="fas btn btn-changePass m-t-20" margin="5" />
                                    <Button row="0" rowSpan="2" col="2" text.decode="&#xf1f8;" @tap="deleteTimeRecord()" class="fas btn btn-reject m-t-20" margin="5" />
                                </GridLayout>
                                <StackLayout class="hr-dark"/>
                                </StackLayout>
                            </StackLayout>
                        </CardView>
                    </v-template>
                </ListView>
            </PullToRefresh>

            <StackLayout row="3" verticalAlignment="bottom" horizontalAlignment="center" >
                <StackLayout class="hr-light"/>
                <StackLayout class="hr-dark"/>
                <StackLayout class="hr-light"/>
                <FlexboxLayout horizontalAlignment="center">
                    <Button text="Cambiar contraseña" @tap="changePassword" class="btn btn-changePass m-t-20" style="width:40%" margin="5" />
                    <Button text="Cerrar Sesión" @tap="logout" class="btn-reject m-t-20" style="width:40%" margin="5" />
                </FlexboxLayout>
            </StackLayout>
        </GridLayout>

    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {
            return {
                hourRecords: []
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
            refreshLists(args) {
                var pullRefresh = args.object;
                this.loadHours();
                setTimeout(function() {
                    pullRefresh.refreshing = false;
                }, 1000);
            },

            logout() {
                this.$store.commit('logout');
                this.$goto('login',{ clearHistory: true });
            },

            changePassword() {
                this.$goto('editPassword');
            },

            editTimeRecord() {
                this.$goto('editTimeRecord');
            },

            deleteTimeRecord(){

            },
            
            formatDateHour(date){
                var d = new Date(date);
                return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            },
            countHours(a,b){
                var timeA = new Date(a);
                var timeB = new Date(b);
                var dif = timeB-timeA;
                return Math.floor((dif)/3600000) + ":" + ("0" + ((dif)/60000)%60).slice(-2);
            },

            loadHours() {
                // Obtengo las operaciones finalizadas
                this.hourRecords = [];
                var dic = {};
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/HoursRecord/GetAllByUser?IdUser=" + this.$store.state.session.userId,
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Authorization": "Bearer " + this.$store.state.session.token
                    },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                    }
                    else {
                        // Ordeno de forma ascendente el resultado
                        result.sort(function(a,b){
                            let x = new Date(a.startDate);
                            let y = new Date(b.startDate);
                            return x-y;
                        });
                        for(var i = 0; i < result.length; i++){
                            var d = new Date(result[i].startDate);
                            // if (dic[this.formatDate(d)] != null){
                            //     dic[this.formatDate(d)] = dic[this.formatDate(d)];
                            // }
                            // else {
                            //     dic[this.formatDate(d)] = [];
                            // }

                            // Esto es lo mismo que en el if, pero en una sola línea
                            // Si ya tengo algo en esa fecha lo concateno, sino, creo la lista...
                            (dic[this.formatDate(d)] != null) ? (dic[this.formatDate(d)] = dic[this.formatDate(d)]) : (dic[this.formatDate(d)] = []);
                            dic[this.formatDate(d)].push(result[i]);
                        }
                        for (var key in dic){
                            var value = dic[key];
                            this.hourRecords.push({"day":key,"list":value});
                        }
                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                });
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
    }

    .subtitle {
        text-align: center;
    }


</style>
