<template>
    <div>
        <q-slider 
          v-model="cloudLevel"
          @change="updateValue"
          :min="0"
          :max="9" 
          :snap="true"
          marker-labels
          style="padding-bottom: 20px; padding-right: 40px;"
        >
            <template v-slot:marker-label-group="{ markerMap }">
                <div class="row items-center no-wrap" :class="markerMap[cloudLevel].classes" :style="markerMap[cloudLevel].style as StyleValue">
                    <q-icon :name="mdiWeatherNight" size="40px" v-if="cloudLevel == 0" color="yellow"/>
                    <q-icon :name="mdiWeatherNightPartlyCloudy" size="40px" color="light-blue-12" style="margin-left: -10px" v-else-if="cloudLevel <= 3" v-for="x in Math.floor(cloudLevel)" />
                    <q-icon :name="mdiCloudOutline" size="40px" color="deep-purple-10" style="margin-left: -10px" v-else-if="cloudLevel <= 6" v-for="x in Math.floor(cloudLevel-3)"/>
                    <q-icon :name="mdiClouds" size="40px" color="blue-grey" style="margin-left: -20px" v-else v-for="x in Math.floor(cloudLevel-6)"/>
                </div>
            </template>
        </q-slider>
    </div>
  </template>
  
  <script setup lang="ts">
  import {StyleValue, ref, watch} from "vue"
  import {
    mdiWeatherNight,
    mdiWeatherNightPartlyCloudy,
    mdiCloudOutline,
    mdiClouds,
  } from "@quasar/extras/mdi-v7"
  
  
  interface Props {modelValue: number}
  const props = withDefaults(defineProps<Props>(), {
    modelValue: 0
  });
  
  const cloudLevel = ref(props.modelValue)

  watch(()=>props.modelValue, ()=>{cloudLevel.value = props.modelValue})
  const emit = defineEmits(['update:modelValue'])
  const updateValue = (value: any) => {
      emit('update:modelValue', value)
  }
  
  </script>