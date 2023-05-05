<template>
  <q-page class="q-pa-xl">
    <q-date v-model="calendarBody.data" mask="YYYY-MM-DD" :events="CallendarStore.dateListEventsFormat" @update:model-value="changeDate"/>
    <br>
    <br>
    <div class="row items-center justify-center wrap">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">Faza księżyca</div>
      <moon-phase v-model="calendarBody.faza_ksiezyca" class="col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10"/>
    </div>
    <div class="row items-center">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">Poziom zachmurzenia</div>
      <cloud-level v-model="calendarBody.zachmurzenie" class="col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10"/>
    </div>
    <div class="row items-center">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">Poziom Mgły</div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10"> 
        <q-slider v-model="calendarBody.gestosc_mgly" :min="0" :max="10" marker-labels style="padding-right: 40px"/>
      </div>
    </div>
    <div class="row items-center" style="margin-top: 30px;">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">Rodzaj Opadu</div>
      <precipitation-type v-model="calendarBody.rodzaj_opadu" class="col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10"/>
    </div>
    <q-btn color="primary" @click="saveChanegs" v-if="dateListArray.includes(calendarBody.data)">Zapisz zmiany</q-btn>
    <q-btn color="primary" @click="saveChanegs" v-else>Dodaj nowy dzień</q-btn>
  </q-page>
</template>

<script setup lang="ts">

import MoonPhase from "components/MoonPhase.vue"
import CloudLevel from 'components/CloudLevel.vue';
import PrecipitationType from "components/PrecipitationType.vue"
import { ref, onMounted } from 'vue';
import {useCallendarStore} from "stores/callendar-store"
import { storeToRefs } from "pinia";
import { date } from "quasar"

const CallendarStore = useCallendarStore()
const { calendarBody, dateListArray } = storeToRefs(CallendarStore)

const changeDate = async (date:string) =>{
  CallendarStore.reesetCalendarBody()
  if (dateListArray.value.includes(calendarBody.value.data))
    await CallendarStore.getCallendarBody(date)
}

const saveChanegs = async () =>{
  if (dateListArray.value.includes(calendarBody.value.data))
    CallendarStore.updateCallendar()
  else
    CallendarStore.insertCallendar()
}
</script>