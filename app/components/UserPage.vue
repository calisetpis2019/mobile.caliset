<template>
    <Page class="page" @navigatedTo="loadHours">
        <OurActionBar userPage="true"/>

        <GridLayout rows="auto,auto,*,auto" >

            <GridLayout row="0" rows="auto,auto" columns="*,auto" >
                <Label colSpan="2" class="subtitle" />
                <Label row="0" col="0" text="REGISTROS DE HORAS" textWrap="true" class="subtitle left info"  />
                <Button row="0" col="1" class="btn btn-primary m-t-20" @tap="createRecord()" background="black" androidElevation="4">
                    <FormattedString>
                        <Span text.decode="+ &#xf017;" class="fas" color="white" fontSize="30" />
                    </FormattedString>
                </Button>
                <StackLayout row="1" colSpan="2" class="hr-light"/>
            </GridLayout>

            <Label row="1" :visibility="hourRecords.length == 0 ? 'visible' : 'collapsed'"
                    :text="msgError == '' ? 'No hay registros de horas para mostrar.' : msgError" textWrap="true" class="info"
                    style="margin-top: 20" />

            <PullToRefresh row="2" @refresh="refreshLists" >
                <ListView class="list-group" for="record in hourRecords">
                    <v-template>
                        <CardView margin="10" elevation="40" radius="1" class="card" >
                            <StackLayout class="card" @tap=";" >
                                <Label :text="record.day" class="subtitle" />
                                <StackLayout class="card" v-for="r in record.list" >
                                <GridLayout rows="auto,auto" columns="*,auto" >
                                    <StackLayout row="0" col="0" >
                                        <Label :text="'Operación ' + r.operation.id + '-' + formatDate(r.operation.date)" class="card-text" />
                                        <Label :text="formatDateHour(r.startDate)" class="card-text" />
                                        <Label :text="formatDateHour(r.endDate)" class="card-text" />
                                    </StackLayout>
                                    <StackLayout row="1" col="0" colSpan="2" orientation="horizontal" horizontalAlignment="center">
                                        <Button text.decode="&#xf044; Editar" @tap="editTimeRecord(r)" width="50%" class="fas btn btn-primary m-t-20" />
                                        <Button text.decode="&#xf1f8; Eliminar" @tap="deleteTimeRecord(r.id)" width="50%" class="fas btn btn-primary m-t-20" backgroundColor="#cb132d" />
                                    </StackLayout>
                                    <Label row="0" col="1" :text="'Total: ' + countHours(r.startDate,r.endDate) + ' hs'" class="card-text" textWrap="true" />
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
                <FlexboxLayout horizontalAlignment="center">
                    <Button text="Cambiar contraseña" @tap="changePassword" class="btn btn-changePass m-t-20" style="width:40%" margin="5" />
                    <Button text="Cerrar Sesión" @tap="logout" class="btn-reject m-t-20" style="width:40%" margin="5" />
                </FlexboxLayout>
            </StackLayout>
        </GridLayout>

    </Page>
</template>

<script>
    import { connectionType, getConnectionType } from 'tns-core-modules/connectivity';
    import * as http from "http";

    export default {

        data() {
            return {
                hourRecords: [],
                msgError: ""
            }
        },

        computed: {
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

            editTimeRecord(record) {
                this.$store.commit('selectedHourRecord',{selectedHourRecord: record});
                this.$goto('editTimeRecord');
            },

            deleteTimeRecord(id){
                // Ver si abrir un modal para pedir confirmación, o algo...
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/HoursRecord/Delete?idHoursRecord=" + id,
                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Authorization": "Bearer " + this.$store.state.session.token
                    },
                }).then(response => {
                    if (response.content.toJSON().success) {
                        alert("Se eliminó el registro de horas con éxito.");
                    }
                    else {
                        alert("No se pudo eliminar el registro de horas.");
                    }
                    this.loadHours();
                }, error => {
                    console.error(error);
                });
            },

            formatDateHour(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
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
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/HoursRecord/GetMyHoursRecordFiltered",
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
                            return y-x;
                        });
                        for(var i = 0; i < result.length; i++){
                            var d = new Date(result[i].startDate);
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
                    this.msgError = "No se pudo conectar al servidor.";
                    console.error(error);
                });
            },

            createRecord(){
                if (getConnectionType() === connectionType.none) {
                    alert("No puede agregar registros de horas sin conexión a Internet...");
                    return;
                }
                else {
                    this.$goto('createTimeRecord')
                }
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

    .subtitle {
        text-align: center;
    }

    .left {
        text-align: left;
    }

    .bold{
        font-weight: bold;
        color: white;
    }


</style>
