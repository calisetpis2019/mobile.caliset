<template @navigatedTo="type== 'register' ? loadOperations() : (type== 'view' ? loadHours(): )">
    <GridLayout rows="auto,auto,auto,auto,auto,auto,*,auto,auto,auto" >

        <StackLayout row="0">
            <Label :text="title" class="subtitle" flexWrapBefore="true"/>
            <StackLayout class="hr-light"/>
        </StackLayout>

        <StackLayout row="1" class="input-field" :visibility="type=='register' ? 'visible' : 'collapsed'">
            <Label text="OPERACIÓN" class="subtitle"/>
            <TextView class="input"  
                editable="false" 
                :text="haveIndex && type=='register' ? operations[operationIndex].operationId : 'Seleccione una operación...'" 
                textAlignment="center" color="white" 
                @tap="showOperations()" />
            <ListPicker 
                :items="operations" textField="operationId" 
                v-model="operationIndex" 
                backgroundColor="#B0C4DE" 
                :visibility="opVisible ? 'visible' : 'collapsed'" 
                @tap="
                    opVisible=false;
                    startDate=operations[operationIndex].date;
                    startTime=operations[operationIndex].date;
                    chosenOperation=true;
                    errorMsg=''" />
        </StackLayout>

        <StackLayout row="1" class="input-field" :visibility="type=='view' ? 'visible' : 'collapsed'">
            <Label text="REGISTROS DE HORAS" class="subtitle"/>
            <TextView class="input"  
                editable="false" 
                :text="haveIndex && type=='view' ? hourRecords[operationIndex].startDate : 'Seleccione un registro de horas...'" 
                textAlignment="center" color="white" 
                @tap="showHours()" />
            <ListPicker 
                :items="hourRecords" textField="startDate" 
                v-model="operationIndex" 
                backgroundColor="#B0C4DE" 
                :visibility="opVisible ? 'visible' : 'collapsed'" 
                @tap="opVisible=false;startDate=hourRecords[operationIndex].startDate;chosenOperation=true;errorMsg=''" />
        </StackLayout>

        <StackLayout row="2" class="input-field"> 
            <Label text="DÍA INICIO" class="subtitle" />
            <TextView 
                editable="false" 
                :text="formatDate(startDate)" 
                textAlignment="center" color="white" 
                @tap="startDateVisible = !startDateVisible;chosenStartDate = true" 
                @blur="startDateVisible = false" /> 
            <DatePicker 
                :year="chosenOperation ? year : ''" 
                :month="chosenOperation ? month : ''" 
                :day="chosenOperation ? day : ''" 
                v-model="startDate"
                :minDate="chosenOperation && type=='register' ? operations[operationIndex].date : (chosenOperation && type == 'view' ? hourRecords[operationIndex].startDate : '2019/09/1')" 
                maxDate="2100/12/31" backgroundColor="#B0C4DE" 
                :visibility="startDateVisible && type=='register' ? 'visible' : 'collapsed'" 
                @tap="startDateVisible = false" />
        </StackLayout>

        <StackLayout row="3" class="input-field">
            <Label text="HORA INICIO" class="subtitle" />
            <TextField class="input"
                editable="false" 
                :text="startTime == '' ? '' : formatDateHour(startTime)"
                textAlignment="center" color="white" 
                @tap="startTimeVisible = !startTimeVisible" 
                @blur="startTimeVisible = false" />
            <TimePicker 
                hour="0" minute="0" 
                v-model="startTime" backgroundColor="#B0C4DE" 
                :visibility="startTimeVisible && type=='register' ? 'visible' : 'collapsed'" 
                @tap="startTimeVisible = false" />
        </StackLayout>

        <StackLayout row="4" class="input-field">
            <Label text="DÍA FIN" class="subtitle" />
            <TextView  
                editable="false" 
                :text="formatDate(endDate)" 
                textAlignment="center" color="white" 
                @tap="endDateVisible = !endDateVisible" 
                @blur="endDateVisible = false" 
                /> 
            <DatePicker 
                :year="year" 
                :month="month" 
                :day="day" 
                v-model="endDate"
                :minDate="chosenStartDate ? startDate : '2019/09/1'" 
                maxDate="2100/12/31" backgroundColor="#B0C4DE" 
                :visibility="endDateVisible && type=='register' ? 'visible' : 'collapsed'" 
                @tap="endDateVisible = false" />
        </StackLayout>

        <StackLayout row="5" class="input-field">
            <Label text="HORA FIN" class="subtitle" />
            <TextField class="input"
                editable="false" 
                :text="endTime == '' ? '' : formatDateHour(endTime)" 
                textAlignment="center" color="white" 
                @tap="endTimeVisible = !endTimeVisible" 
                @blur="endTimeVisible = false" /> 
            <TimePicker 
                hour="0" minute="0" 
                v-model="endTime" backgroundColor="#B0C4DE" 
                :visibility="endTimeVisible && type=='register' ? 'visible' : 'collapsed'" 
                @tap="endTimeVisible = false" />
        </StackLayout>

        <StackLayout row="6" class="input-field">
            <Label text="TOTAL DE HORAS" class="subtitle" />
            <TextView 
                editable="false" 
                :text="(startTime == '' || endTime == '') ? '' : countHours" 
                textAlignment="center" color="white" />
        </StackLayout>
        
        <ActivityIndicator row="7" :busy="processing" :visibility="processing ? 'visible' : 'collapsed'" color="white"></ActivityIndicator>
        
        <Label row="8" class="info" 
            :text="errorMsg" 
            textWrap="true" 
            :visibility="errorMsg != '' ? 'visible' : 'collapsed'" />
        
        <Button row="9" class="btn btn-primary m-t-20" 
            :isEnabled="!processing" 
            text="Cargar registro de horas" 
            :visibility="type == 'register' ? 'visible' : 'collapsed'" 
            @tap="createHourRecord" />
        
    </GridLayout>
</template>

<script>
    import * as http from "http";

    export default {
        props: ["title","type"],

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
                errorStartEnd: false,

                hourRecords: []
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
            },

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
            },

            showHours() {
                this.loadHours();
                this.haveIndex = true;
                this.opVisible = true;
                this.hourRecords = [];
                this.hourRecords = this.hourRecords.concat(this.$store.state.hourRecords);
            },

            loadOperations() {
                // Obtengo las operaciones finalizadas
                this.finishedOperations = [];
                http.request({
                    url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyOperationsConfirmed?operationStateId=3",
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

            loadHours() {
                // Obtengo las operaciones finalizadas
                this.hourRecords = [];
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
                        for(var i = 0; i < result.length; i++){
                            this.hourRecords.push(result[i]);
                        }
                        this.$store.commit('hourRecords',{ hours: this.hourRecords });
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
                                this.errorMsg = "El registro de hora se hizo correctamente.";
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

    // .subtitle {
    //     font-size: 15px;
    //     font-weight: bold;
    // }

</style>
