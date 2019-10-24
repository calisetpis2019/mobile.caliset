<template>
    <Page class="page" backgroundColor="#1F1B24" @navigatedTo="loadOperations()">
        <OurActionBar/>
        <ScrollView>
            <GridLayout rows="auto,auto,auto,auto,auto,auto" >

                <!-- <Label row="0" text="Registro de Horas" class="subtitle" color="white"/> -->
                <StackLayout row="0">
                    <Label text="REGISTRO DE HORAS" class="subtitle" flexWrapBefore="true"/>
                    <StackLayout class="hr-light"></StackLayout>
                </StackLayout>


                <StackLayout row="1" class="input-field">
                    
                    <Label text= "OPERACIÓN" class="subtitle"/>
                    <!-- <TextFIeld editable="false" color="white" :text="operationsIds[operationIndex]" class="input"  @tap="showOperations()" /> -->
                    <TextFIeld editable="false" color="white" :text="yaAbrio ? this.$store.state.operations[operationIndex] : 'hola'" class="input"  @tap="showOperations()" />
                    <!-- <ListPicker :items="operationsIds" v-model="operationIndex" backgroundColor="#B0C4DE" v-show="opVisible" @tap="opVisible=false" /> -->
                    <ListPicker :items="this.$store.state.operations" v-model="operationIndex" backgroundColor="#B0C4DE" :visibility="opVisible ? 'visible' : 'collapsed'" @tap="opVisible=false" />

                </StackLayout>

                <StackLayout row="2" class="input-field">
                    
                    <Label text="DÍA" class="subtitle" />
                    <TextFIeld editable="false" color="white" :text="date" class="input"  @focus="showDate()" @blur="hideDate()"  /> 

                    <DatePicker :year="currentYear" :month="currentMonth" :day="currentDay" v-model="date"
                        minDate="2019-09-01" maxDate="2100-12-31" backgroundColor="#B0C4DE" v-show="dateVisible"/>
                </StackLayout>  

                <StackLayout row="3" class="input-field">

                    <Label text="INICIO" class="subtitle" />

                    <TextField editable="false" color="white" :text="start" class="input" @focus="showTime()" @blur="hideTime()" />

                    <TimePicker :hour="currentHour" :minute="currentMinute" v-model="start"
                        backgroundColor="#B0C4DE" v-show="timeVisible" />
                </StackLayout>

                <StackLayout row="4" class="input-field">

                    <Label text="FIN" class="subtitle" />
                    <TextField color="white"  class="input" keyboardType="number" />
                </StackLayout>

                <Button row="5" text="Cargar registro de horas" class="btn btn-primary m-t-20" />
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

                time: {
                    date : '01/01/1800',
                    start : '00:00',
                    hours : '0'
                },

                dateVisible : false,
                timeVisible : false,
                opVisible : false,
                date : "",
                start : "",

                operationIndex: 0,
                // operations: [],
                yaAbrio: false
            };
        },

        computed: {
            user() {
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
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

            showDate() {
                this.dateVisible = true;
                return;
            },

            hideDate(){
                this.dateVisible = false;
                return;
            },
            showTime() {
                this.timeVisible = true;
                return;
            },

            hideTime(){
                this.timeVisible = false;
                return;
            },
            showOperations() {
                this.loadOperations();
                this.yaAbrio = true;
                this.opVisible = true;
            },

            loadOperations() {
                // this.operations = [];
                this.$store.commit('load');
                // Obtengo las operaciones finalizadas
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

                        // for(var i = 0; i < result.length; i++){
                        //     this.operations.push(result[i].id + '-' + this.formatDate(result[i].date));
                        // }

                        // this.$store.commit('operations',{ operations: this.operations });
                        console.log(this.$store.state.operations);

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
