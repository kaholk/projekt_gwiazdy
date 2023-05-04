<template>
<div>
  <q-slider v-model="percitipationType" @change="updateValue" :min="0" :max="4" marker-labels style="padding-bottom: 20px; padding-right: 40px;">
    <template v-slot:marker-label-group="{markerList}">
          <div
            v-for="marker in markerList as any as SliderMarkerLabelConfig[]"
            :key="marker.index"
            :class=" marker.classes"
            :style="marker.style as StyleValue"
          >
          <q-icon :name="precipitationTypes[marker.index].icon" size="40px"/>
        </div>
    </template>
  </q-slider>
</div>

</template>
<script setup lang="ts">
  import {StyleValue, ref, watch} from "vue"
  import {
    mdiWeatherPouring,
    mdiWeatherRainy,
    mdiWeatherSnowyRainy,
    mdiWeatherPartlyRainy,
    mdiWeatherLightningRainy,
    mdiWeatherPartlySnowyRainy,
    mdiWeatherSnowy,
    mdiWeatherSnowyHeavy,
    mdiWeatherLightning,
    mdiWeatherPartlyLightning,
    mdiWeatherPartlySnowy,
    mdiWeatherSunny,
    mdiCloudOffOutline 
  } from "@quasar/extras/mdi-v7"
import { SliderMarkerLabelConfig } from "quasar/dist/types/api/slider";

interface Props {modelValue: number}
const props = withDefaults(defineProps<Props>(), {
    modelValue: 0
});

const percitipationType = ref(props.modelValue)


watch(()=>props.modelValue, ()=>{percitipationType.value = props.modelValue})
const emit = defineEmits(['update:modelValue'])
const updateValue = (value: any) => {emit('update:modelValue', value)}

const precipitationTypes = [
  {"name": "", "icon": mdiCloudOffOutline},
  {"name": "", "icon": mdiWeatherPouring},
  // {"name": "", "icon": mdiWeatherRainy},
  // {"name": "", "icon": mdiWeatherSnowyRainy},
  // {"name": "", "icon": mdiWeatherPartlyRainy},
  {"name": "", "icon": mdiWeatherLightningRainy},
  {"name": "", "icon": mdiWeatherPartlySnowyRainy},
  {"name": "", "icon": mdiWeatherSnowy},
  // {"name": "", "icon": mdiWeatherSnowyHeavy},
  // {"name": "", "icon": mdiWeatherLightning},
  // {"name": "", "icon": mdiWeatherPartlyLightning},
  // {"name": "", "icon": mdiWeatherPartlySnowy},
  // {"name": "", "icon": mdiWeatherSunny},
]
</script>