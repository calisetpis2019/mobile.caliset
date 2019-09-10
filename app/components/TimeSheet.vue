<template>
    <Page class="page" backgroundColor="#1F1B24">

        <ActionBar title="Operaciones" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Label :text=email horizontalAlignment="right" color="white" style="margin:10px" />
            </GridLayout>
        </ActionBar>
        <StackLayout class="form">

            <Label text="Registro de Horas" class="subtitile" color="white"/>

            <GridLayout rows="auto,auto,auto">

                <StackLayout row="0" >
                    
                    <Label text= "Operación:" color="white"/>
                    <TextFIeld color="white" :text="selectedOperation" class="input" android:editable="false" @focus="showOperations()" 
                    @blur="hideOperations()"  />

                    <ListPicker :items="$props.actives.name" :v-model="selectedOperation" backgroundColor="#B0C4DE" color="white" v-show="opVisible" />

                </StackLayout>

                <StackLayout row="1" class="input-field">
                    
                    <Label text="Día:" color="white"/>
                    <TextFIeld color="white" :text="date" class="input" android:editable="false" @focus="showDate()" @blur="hideDate()"  /> 

                    <DatePicker :year="currentYear" :month="currentMonth" :day="currentDay" v-model="date"
                        minDate="2019-09-01" maxDate="2100-12-31" backgroundColor="#B0C4DE" v-show="dateVisible"/>
                </StackLayout>  

                <StackLayout row="2" class="input-field">

                    <Label text="Inicio:" color="white"/>

                    <TextField color="white" :text="start" android:editable="false" class="input" @focus="showTime()" @blur="hideTime()"  />

                    <TimePicker :hour="currentHour" :minute="currentMinute" v-model="start"
                        backgroundColor="#B0C4DE" v-show="timeVisible" />
                </StackLayout>

            </GridLayout>

            <Button text="CARGAR" class="btn btn-primary m-t-20"></Button>

        </StackLayout>
    <!--
                <Label text="Hora fin:" class="text" />
                <TimePicker :hour="currentHour" :minute="currentMinute" backgroundColor="white" />
    -->
            

    </Page>
</template>

<script>
    export default {

        props: ['email','token','actives','selectedOperation'],

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
                start : ""
            };
        },

        computed: {
            message() {
                return "Blank {N}-Vue app";
            }
        },

        methods: {

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
                this.opVisible = true;
                return;
            },

            hideOperations(){
                this.opVisible = false;
                return;
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

    .subtitile {
        text-align: center;
        font-size: 30px;
        background-color: #1F1B24;
        color: white;
        margin: 50px;
    }

    .btn {
        margin: 50px;
    }

    .text{
        font-size: 15px;
        margin: 5px;
        color: white;
    }

    .input {
        font-size: 18;
        placeholder-color: #A8A8A8;
        background-color: blue;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }


    .input-field {
        margin-bottom: 25;
    }

</style>
