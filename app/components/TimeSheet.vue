<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadOperations()">
        <OurActionBar/>
        <ScrollView>
            <GridLayout rows="auto,auto,auto,auto,auto,auto,*,auto" >

                <StackLayout row="0">
                    <Label text="REGISTRO DE HORAS" class="subtitle" flexWrapBefore="true"/>
                    <StackLayout class="hr-light"></StackLayout>
                </StackLayout>

                <StackLayout row="1" class="input-field">
                    <Label text= "OPERACIÓN" class="subtitle"/>
                    <TextView editable="false" color="white" :text="haveIndex ? operations[operationIndex].operationId : 'Seleccione una operación...'" class="input"  @tap="showOperations()" textAlignment="center" />
                    <ListPicker :items="operations" textField="operationId" v-model="operationIndex" backgroundColor="#B0C4DE" :visibility="opVisible ? 'visible' : 'collapsed'" @tap="opVisible=false;startDate=operations[operationIndex].date;chosenOperation=true" />
                </StackLayout>

                <StackLayout row="2" class="input-field"> 
                    <Label text="DÍA INICIO" class="subtitle" />
                    <TextView editable="false" color="white" :text="formatDate(startDate)" class="input" @tap="startDateVisible = !startDateVisible;chosenStartDate = true" @blur="startDateVisible = false" textAlignment="center" /> 
                    <DatePicker :year="chosenOperation ? year : currentYear" :month="chosenOperation ? month : currentMonth" :day="chosenOperation ? day : currentDay" v-model="startDate"
                        :minDate="chosenOperation ? operations[operationIndex].date : '2019-09-01'" maxDate="2100-12-31" backgroundColor="#B0C4DE" :visibility="startDateVisible ? 'visible' : 'collapsed'" @tap="startDateVisible = false" />
                </StackLayout>

                <StackLayout row="3" class="input-field">
                    <Label text="HORA INICIO" class="subtitle" />
                    <TextView editable="false" color="white" :text="startTime == '' ? '' : formatDateHour(startTime)" class="input" @tap="startTimeVisible = !startTimeVisible" @blur="startTimeVisible = false" textAlignment="center" />
                    <TimePicker :year="currentYear" :month="currentMonth" :day="currentDay" :hour="currentHour" :minute="currentMinute" v-model="startTime"
                        backgroundColor="#B0C4DE" :visibility="startTimeVisible ? 'visible' : 'collapsed'" @tap="startTimeVisible = false" />
                </StackLayout>

                <StackLayout row="4" class="input-field">
                    <Label text="DÍA FIN" class="subtitle" />
                    <TextView editable="false" color="white" :text="formatDate(endDate)" class="input" @tap="endDateVisible = !endDateVisible" @blur="endDateVisible = false" textAlignment="center" /> 
                    <DatePicker :year="year" :month="month" :day="day" v-model="endDate"
                        :minDate="chosenStartDate ? startDate : '2019-09-01'" maxDate="2100-12-31" backgroundColor="#B0C4DE" :visibility="endDateVisible ? 'visible' : 'collapsed'" @tap="endDateVisible = false" />
                </StackLayout>

                <StackLayout row="5" class="input-field">
                    <Label text="HORA FIN" class="subtitle" />
                    <TextView editable="false" color="white" :text="endTime == '' ? '' : formatDateHour(endTime)" class="input"  @tap="endTimeVisible = !endTimeVisible" @blur="endTimeVisible = false" textAlignment="center" />
                    <TimePicker :hour="currentHour" :minute="currentMinute" v-model="endTime"
                        backgroundColor="#B0C4DE" :visibility="endTimeVisible ? 'visible' : 'collapsed'" @tap="endTimeVisible = false" />
                </StackLayout>

                <StackLayout row="6" class="input-field">
                    <Label text="TOTAL DE HORAS" class="subtitle" />
                    <TextView :text="(startTime == '' || endTime == '') ? '' : countHours" color="white" editable="false" textAlignment="center" />
                </StackLayout>

                <Button row="7" text="Cargar registro de horas" class="btn btn-primary m-t-20" />
                
            </GridLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import * as http from "http";

    export default {

        data() {

            return {
                currentDay: new Date().getUTCDate(),
                currentMonth: new Date().getUTCMonth() + 1,
                currentYear: new Date().getUTCFullYear(),
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
                
                chosenOperation: false,
                chosenStartDate: false,
                operationIndex: 0,
                operations: [],
                finishedOperations: [],
                haveIndex: false,
            };
        },

        computed: {
            countHours(){
                var st = new Date(this.startTime);
                var en = new Date(this.endTime);
                var aux = en-st;
                if (aux < 0){
                    return "La hora de inicio no puede ser posterior a la hora de fin.";
                }
                return ("0" + Math.floor((aux)/3600000)).slice(-2) + ":" + ("0" + ((aux)/60000)%60).slice(-2);
            },
            year(){
                var d = new Date(this.startDate);
                return d.getFullYear();
            },
            month(){
                var d = new Date(this.startDate);
                return d.getMonth() + 1;
            },
            day(){
                var d = new Date(this.startDate);
                return d.getDate();
            }
        },

        methods: {
            formatDateHour(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " - " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            },
            formatDate(date){
                var d = new Date(date);
                return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            },
            formatDatePicker(date){
                var d = new Date(date);
                return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
            },

            showOperations() {
                this.loadOperations();
                this.haveIndex = true;
                this.opVisible = true;
                this.operations = [];
                // this.operations.push(" ");
                this.operations = this.operations.concat(this.$store.state.activeOperations.concat(this.$store.state.finishedOperations));
            },

            loadOperations() {
                // Obtengo las operaciones finalizadas
                this.finishedOperations = [];
                http.request({
                url: "http://" + this.$store.state.ipAPI + ":21021/api/services/app/Assignation/GetMyOperationsConfirmed?operationStateId=1",
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + this.$store.state.session.token },
                }).then(response => {
                    var result = response.content.toJSON().result;
                    if (result == null) {
                        this.processing=false;
                        console.log(result);
                    }
                    else {
                        for(var i = 0; i < result.length; i++){
                            this.finishedOperations.push({id: result[i].id,date: result[i].date,operationId: result[i].id + '-' + this.formatDate(result[i].date)});
                        }
                        this.$store.commit('finishedOperations',{ operations: this.finishedOperations });

                    }
                }, error => {
                    this.processing=false;
                    console.error(error);
                });
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
