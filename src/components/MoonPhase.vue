<template>
  <div>
    <q-slider 
      v-model="moonPhase"
      @change="updateValue"
      :min="1"
      :max="8" 
      :snap="true"
      marker-labels
      style="padding-bottom: 20px; padding-right: 40px;"
    >
      <template v-slot:marker-label-group="{ markerMap }">
        <div class="col items-center wrap" :class="markerMap[moonPhase].classes" :style="markerMap[moonPhase].style as StyleValue">
            <q-icon :name="moonPhases[moonPhase-1].icon" size="40px" color="yellow"/>
            {{ moonPhases[moonPhase-1].name }}
        </div>
      </template>
    </q-slider>

  </div>
</template>

<script setup lang="ts">
import {StyleValue, ref, watch} from "vue"
import {
    mdiMoonNew, 
    mdiMoonWaxingCrescent, 
    mdiMoonFirstQuarter, 
    mdiMoonWaxingGibbous,
    mdiMoonFull,
    mdiMoonWaningGibbous,
    mdiMoonLastQuarter,
    mdiMoonWaningCrescent
} from "@quasar/extras/mdi-v7"


interface Props {modelValue: number}


const props = withDefaults(defineProps<Props>(), {
  modelValue: 1
});
const moonPhase = ref(props.modelValue)




watch(()=>props.modelValue, ()=>{moonPhase.value = props.modelValue})
const emit = defineEmits(['update:modelValue'])
const updateValue = (value: any) => {emit('update:modelValue', value)}


const moonPhases = [
  {"name": "nów", "icon": mdiMoonNew},
  {"name": "przybywający sierp",  "icon": mdiMoonWaxingCrescent},
  {"name": "pierwsza kwadra", "icon": mdiMoonFirstQuarter},
  {"name": "rosnący garb", "icon": mdiMoonWaxingGibbous},
  {"name": "pełnia", "icon": mdiMoonFull},
  {"name": "znikający garb", "icon": mdiMoonWaningGibbous},
  {"name": "ostatnia kwadra", "icon": mdiMoonLastQuarter},
  {"name": "znikający sierp", "icon": mdiMoonWaningCrescent},
]

</script>