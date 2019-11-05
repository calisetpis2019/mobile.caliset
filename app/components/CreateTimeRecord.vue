<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadOperations()">
        <OurActionBar/>
        <ScrollView>
            <GridLayout rows="auto,auto,auto,auto,auto,auto,*,auto,auto,auto" >

                <StackLayout row="0">
                    <Label text="REGISTRO DE HORAS" class="subtitle" flexWrapBefore="true"/>
                    <StackLayout class="hr-light"></StackLayout>
                </StackLayout>

                <StackLayout row="1" class="input-field">
                    <Label text= "OPERACIÓN" class="subtitle"/>
                    <TextView editable="false" color="white" :text="haveIndex ? operations[operationIndex].operationId : 'Seleccione una operación...'" class="input"  @tap="showOperations()" textAlignment="center" />
                    <ListPicker :items="operations" textField="operationId" v-model="operationIndex" backgroundColor="#B0C4DE" :visibility="opVisible ? 'visible' : 'collapsed'" @tap="opVisible=false;startDate=operations[operationIndex].date;chosenOperation=true;errorMsg=''" />
                </StackLayout>

                <StackLayout row="2" class="input-field"> 
                    <Label text="DÍA INICIO" class="subtitle" />
                    <TextView editable="false" color="white" :text="formatDate(startDate)" class="input" @tap="startDateVisible = !startDateVisible;chosenStartDate = true" @blur="startDateVisible = false" textAlignment="center" /> 
                    <DatePicker :year="chosenOperation ? year : ''" :month="chosenOperation ? month : ''" :day="chosenOperation ? day : ''" v-model="startDate"
                        :minDate="chosenOperation ? operations[operationIndex].date : '2019/09/1'" maxDate="2100/12/31" backgroundColor="#B0C4DE" :visibility="startDateVisible ? 'visible' : 'collapsed'" @tap="startDateVisible = false" />
                </StackLayout>

                <StackLayout row="3" class="input-field">
                    <Label text="HORA INICIO" class="subtitle" />
                    <TextField editable="false" color="white" :text="startTime == '' ? '' : formatDateHour(startTime)" class="input" @tap="startTimeVisible = !startTimeVisible" @blur="startTimeVisible = false" textAlignment="center" />
                    <TimePicker hour="0" minute="0" v-model="startTime"
                        backgroundColor="#B0C4DE" :visibility="startTimeVisible ? 'visible' : 'collapsed'" @tap="startTimeVisible = false" />
                </StackLayout>

                <StackLayout row="4" class="input-field">
                    <Label text="DÍA FIN" class="subtitle" />
                    <TextView editable="false" color="white" :text="formatDate(endDate)" class="input" @tap="endDateVisible = !endDateVisible" @blur="endDateVisible = false" textAlignment="center" /> 
                    <DatePicker :year="year" :month="month" :day="day" v-model="endDate"
                        :minDate="chosenStartDate ? startDate : '2019/09/1'" maxDate="2100/12/31" backgroundColor="#B0C4DE" :visibility="endDateVisible ? 'visible' : 'collapsed'" @tap="endDateVisible = false" />
                </StackLayout>

                <StackLayout row="5" class="input-field">
                    <Label text="HORA FIN" class="subtitle" />
                    <TextField editable="false" color="white" :text="endTime == '' ? '' : formatDateHour(endTime)" class="input"  @tap="endTimeVisible = !endTimeVisible" @blur="endTimeVisible = false" textAlignment="center" />
                    <TimePicker hour="0" minute="0" v-model="endTime"
                        backgroundColor="#B0C4DE" :visibility="endTimeVisible ? 'visible' : 'collapsed'" @tap="endTimeVisible = false" />
                </StackLayout>

                <StackLayout row="6" class="input-field">
                    <Label text="TOTAL DE HORAS" class="subtitle" />
                    <TextView :text="(startTime == '' || endTime == '') ? '' : countHours" color="white" editable="false" textAlignment="center" />
                </StackLayout>
                
                <ActivityIndicator row="7" :busy="processing" :visibility="processing ? 'visible' : 'collapsed'" color="white"></ActivityIndicator>
                <Label row="8" :text="errorMsg" class="info" textWrap="true" :visibility="errorMsg != '' ? 'visible' : 'collapsed'" />
                <Button row="9" text="Cargar registro de horas" class="btn btn-primary m-t-20" :isEnabled="!processing" @tap="createHourRecord" />

            </GridLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {

            return {
                currentHour: new Date().getUTCHours(),
                currentMinute : new Date().getUTCMinutes(),

                startDateVisible : false,
                endDateVisible : false,
                startTimeVisible : false,
                endTimeVisible : false,
                opVisible : false,
                startDate : "",
                endDate : "",
                startTime : "",
                endTime: "",
                
                startRecord: "",
                endRecord: "",

                chosenOperation: false,
                chosenStartDate: false,
                operationIndex: 0,
                operations: [],
                finishedOperations: [],
                haveIndex: false,

                processing: false,
                errorMsg: "",
                errorStartEnd: false
            };
        },

        computed: {
            countHours(){
                var sT = new Date(this.startTime);
                var eT = new Date(this.endTime);
                var sD = new Date(this.startDate);
                var eD = new Date(this.endDate);
                this.startRecord = new Date(sD.getFullYear() + '/' + (sD.getMonth()+1) + '/' + sD.getDate() + ' ' +  sT.getHours() + ':' + sT.getMinutes() + ':00');
                this.endRecord = new Date(eD.getFullYear() + '/' + (eD.getMonth()+1) + '/' + eD.getDate() + ' ' + eT.getHours() + ':' + eT.getMinutes() + ':00');
                var dif = this.endRecord-this.startRecord;
                if (dif <= 0){
                    this.errorStartEnd = true;
                    return "";
                }
                this.errorMsg = "";
                this.errorStartEnd = false;
                return Math.floor((dif)/3600000) + ":" + ("0" + ((dif)/60000)%60).slice(-2);
            },
            year(){
                var d = new Date(this.startDate);
                return d.getFullYear();
            },
            month(){
                var d = new Date(this.startDate);
                return d.getMonth()+1;
            },
            day(){
                var d = new Date(this.startDate);
                return d.getDate();
            }
        },

        methods: {
            formatDateHour(date){
                var d = new Date(date);
                return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            },

            showOperations() {
                this.loadOperations();
                this.haveIndex = true;
                this.opVisible = true;
                this.operations = [];
                this.operations = this.operations.concat(this.$store.state.activeOperations.concat(this.$store.state.finishedOperations));
                //Ordeno por fecha
                this.operations.sort(function(a,b){
                    let x = new Date(a.date);
                    let y = new Date(b.date);
                    return x-y;
                });
                //Ordeno por id de operación
                this.operations.sort(function(a,b){
                    let x = a.id;
                    let y = b.id;
                    return x-y;
                });
            },

            loadOperations() {
                // Obtengo las operaciones finalizadas
                this.finishedOperations = [];
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyOperationsFinished",
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Authorization": "Bearer " + this.$store.state.session.token
                    },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                        console.log(result);
                    }
                    else {
                        for(var i = 0; i < result.length; i++){
                            this.finishedOperations.push({
                                id: result[i].id,
                                date: result[i].date,
                                operationId: result[i].id + '-' + this.formatDate(result[i].date)
                            });
                        }
                        this.$store.commit('finishedOperations',{ operations: this.finishedOperations });

                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                });
            },

            createHourRecord(){
                this.processing = true;
                if (this.operations[this.operationIndex] == null) {
                    this.errorMsg = "Debe eligir una operación.";
                    this.processing = false;
                }
                else {
                    var dateOper = new Date(this.operations[this.operationIndex].date);
                    dateOper.setHours(0,0,0);
                    if (this.startRecord == '' || this.endRecord == '') {
                    this.errorMsg = "Debe completar las horas antes de intentar registrarlas.";
                    this.processing = false;
                    }
                    else if (this.errorStartEnd){
                        this.errorMsg = "La fecha de inicio debe ser anterior a la fecha de fin.";
                        this.processing = false;
                    }
                    else if (this.startRecord - dateOper <= -60000){
                        this.errorMsg = "La fecha de la operación debe ser anterior a la fecha de inicio.";
                        this.processing = false;
                    }
                    else {
                        http.request({
                            url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/HoursRecord/Create",
                            method: "POST",
                            headers: { 
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + this.$store.state.session.token 
                            },
                            content: JSON.stringify({
                                "startDate": this.startRecord,
                                "endDate": this.endRecord,
                                "operationId": this.operations[this.operationIndex].id
                            })
                        }).then(response => {
                            var success = response.content.toJSON().success;
                            if (!success) {
                                console.log(response.content.toJSON().error);
                                this.errorMsg = response.content.toJSON().error.details;
                            }
                            else {
                                alert("El registro de horas se hizo correctamente.");
                                this.$goto('userPage',{ clearHistory: true });
                            }
                            this.processing=false;
                        }, error => {
                            this.processing=false;
                            console.error(error);
                        });
                    }

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
