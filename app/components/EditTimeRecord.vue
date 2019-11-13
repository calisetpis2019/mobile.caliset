<template>
    <Page class="page" >
        <OurActionBar/>
        <ScrollView>
            <GridLayout rows="auto,auto,auto,auto,auto,auto,*,auto,auto,auto" class="list-group" >

                <StackLayout row="0">
                    <Label text="EDITAR REGISTRO DE HORAS" class="subtitle" flexWrapBefore="true"/>
                    <StackLayout class="hr-light"/>
                </StackLayout>

                <StackLayout row="1" class="input-field" >
                    <Label text="OPERACIÓN" class="subtitle"/>
                    <TextView class="input" editable="false" 
                        :text="recordOperation" 
                        textAlignment="center" color="white" />
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
                        v-model="startDate"
                        :minDate="chosenOperation ? this.$store.state.selectedHourRecord.operation.date : '2019/09/1'" 
                        maxDate="2100/12/31" backgroundColor="#cdd4db" 
                        :visibility="startDateVisible ? 'visible' : 'collapsed'" 
                        @tap="startDateVisible = false" />
                </StackLayout>

                <StackLayout row="3" class="input-field">
                    <Label text="HORA INICIO" class="subtitle" />
                    <TextField class="input"
                        editable="false" 
                        :text="startTime == '' ? '' : formatHour(startTime)"
                        textAlignment="center" color="white" 
                        @tap="startTimeVisible = !startTimeVisible" 
                        @blur="startTimeVisible = false" />
                    <TimePicker 
                        hour="0" minute="0" 
                        v-model="startTime" backgroundColor="#cdd4db" 
                        :visibility="startTimeVisible ? 'visible' : 'collapsed'" 
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
                        :minDate="chosenStartDate ? startDate : this.$store.state.selectedHourRecord.operation.date" 
                        maxDate="2100/12/31" backgroundColor="#cdd4db" 
                        :visibility="endDateVisible ? 'visible' : 'collapsed'" 
                        @tap="endDateVisible = false" />
                </StackLayout>

                <StackLayout row="5" class="input-field">
                    <Label text="HORA FIN" class="subtitle" />
                    <TextField class="input"
                        editable="false" 
                        :text="endTime == '' ? '' : formatHour(endTime)" 
                        textAlignment="center" color="white" 
                        @tap="endTimeVisible = !endTimeVisible" 
                        @blur="endTimeVisible = false" /> 
                    <TimePicker 
                        hour="0" minute="0" 
                        v-model="endTime" backgroundColor="#cdd4db" 
                        :visibility="endTimeVisible ? 'visible' : 'collapsed'" 
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
                text="Editar registro de horas" 
                @tap="editHourRecord" />
                
            </GridLayout>
        </ScrollView>

    </Page>
</template>


<script>
    import * as http from "http";

    export default {
        props: ["title","type"],

        data() {

            return {

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

                chosenOperation: true,
                chosenStartDate: false,
                operationIndex: 0,
                operations: [],
                finishedOperations: [],
                haveIndex: false,

                processing: false,
                errorMsg: "",
                errorStartEnd: false,

                recordOperation: this.$store.state.selectedHourRecord.operation.id + '-' + 
                        this.formatDate(this.$store.state.selectedHourRecord.operation.date) + ' - ' + 
                        this.$store.state.selectedHourRecord.operation.operationType.name + ' - ' +
                        this.$store.state.selectedHourRecord.operation.charger.name + ' - ' +
                        this.$store.state.selectedHourRecord.operation.location.name
            };
        },

        computed: {
            countHours(){
                var sT = new Date(this.startTime);
                var eT = new Date(this.endTime);
                var sD = new Date(this.startDate);
                var eD = new Date(this.endDate);

                this.startRecord = new Date(Date.UTC(sD.getFullYear(),sD.getMonth(), sD.getDate() ,sT.getHours(), sT.getMinutes() , '0'));
                this.endRecord = new Date(Date.UTC(eD.getFullYear(),eD.getMonth(), eD.getDate() ,eT.getHours(), eT.getMinutes() , '0'));

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
            formatHour(date){
                var d = new Date(date);
                return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            },

            editHourRecord(){
                this.processing = true;
                var dateOper = new Date(this.$store.state.selectedHourRecord.operation.date);
                var dateOperUTC = new Date(Date.UTC(dateOper.getFullYear(),dateOper.getMonth(),dateOper.getDate(),'0','0','0'));
                
                if (this.startRecord == '' || this.endRecord == '') {
                    this.errorMsg = "Debe completar las horas antes de intentar registrarlas.";
                    this.processing = false;
                }
                else if (this.errorStartEnd){
                    this.errorMsg = "La fecha de inicio debe ser anterior a la fecha de fin.";
                    this.processing = false;
                }
                else if (this.startRecord - dateOperUTC < 0){
                    this.errorMsg = "La fecha de la operación debe ser anterior a la fecha de inicio.";
                    this.processing = false;
                }
                else {
                    http.request({
                        url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/HoursRecord/Update",
                        method: "PUT",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + this.$store.state.session.token 
                        },
                        content: JSON.stringify({
                            "id": this.$store.state.selectedHourRecord.id,
                            "startDate": this.startRecord,
                            "endDate": this.endRecord,
                            "inspectorId": this.$store.state.session.userId,
                            "operationId": this.$store.state.selectedHourRecord.operation.id
                        })
                    }).then(response => {
                        var success = response.content.toJSON().success;
                        if (!success) {
                            console.log(response.content.toJSON().error);
                            this.errorMsg = response.content.toJSON().error.details;
                        }
                        else {
                            alert("El registro de horas se editó correctamente.");
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

</style>
