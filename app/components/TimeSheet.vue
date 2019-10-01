<template>
    <Page class="page" backgroundColor="#1F1B24">

        <!-- <ActionBar title="TimeSheet" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="*" >
                <Label text="CALISET S.A." color="white" horizontalAlignment= "left" style="margin:5px"/>
                <Button :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/> 
            </GridLayout>
        </ActionBar> -->
        <ActionBar title="Home" class="action-bar" backgroundColor="#1F1B24" >
            <GridLayout rows="auto" columns="auto,*,*" >
                <Image row="0" col="0" src="~/images/logo.png" class="action-image" stretch="aspectFit" height="140px" horizontalAlignment="left"></Image>
                <Button row="0" col="2" :text=user horizontalAlignment="right" class="btn-primary" color="white" style="margin:10px" 
                @tap="$goto('userPage')"/>
            </GridLayout>
        </ActionBar>
        <GridLayout rows="auto,auto,auto,auto,auto,auto">

            <Label row="0" text="Registro de Horas" class="subtitle" color="white"/>

            <StackLayout row="1" class="input-field">
                
                <Label text= "Operación:" color="white"/>
                <TextFIeld editable="false" color="white" :text="selectedOperation" class="input"  @focus="showOperations()" 
                @blur="hideOperations()"  />

                <ListPicker :items="$props.operations" :v-model="selectedOperation" backgroundColor="#B0C4DE" color="white" v-show="opVisible" />

            </StackLayout>

            <StackLayout row="2" class="input-field">
                
                <Label text="Día:" color="white"/>
                <TextFIeld editable="false" color="white" :text="date" class="input"  @focus="showDate()" @blur="hideDate()"  /> 

                <DatePicker :year="currentYear" :month="currentMonth" :day="currentDay" v-model="date"
                    minDate="2019-09-01" maxDate="2100-12-31" backgroundColor="#B0C4DE" v-show="dateVisible"/>
            </StackLayout>  

            <StackLayout row="3" class="input-field">

                <Label text="Inicio:" color="white"/>

                <TextField editable="false" color="white" :text="start" class="input" @focus="showTime()" @blur="hideTime()" />

                <TimePicker :hour="currentHour" :minute="currentMinute" v-model="start"
                    backgroundColor="#B0C4DE" v-show="timeVisible" />
            </StackLayout>

            <StackLayout row="4" class="input-field">

                <Label text="Horas:" color="white"/>
                <TextField color="white"  class="input" keyboardType="number" />
            </StackLayout>

            <Button row="5" text="CARGAR" class="btn btn-primary m-t-20"></Button>
        </GridLayout>
    <!--
                <Label text="Hora fin:" class="text" />
                <TimePicker :hour="currentHour" :minute="currentMinute" backgroundColor="white" />
    -->
            

    </Page>
</template>

<script>
    export default {

        props: ['operations'],

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
            user() {
                // return this.$store.state.session.email;
                var name = this.$store.state.session.email.substring(0, this.$store.state.session.email.lastIndexOf("@"));
                return name;
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

    .subtitle {
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
