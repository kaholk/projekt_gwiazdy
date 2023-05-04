import { defineStore } from 'pinia';
import { api, apiQuery } from 'src/boot/axios';
import { ref, computed, onMounted } from 'vue';
import { useQuasar, date } from "quasar"

interface ICalendarHeader{
    data: string
}

interface ICallendarBody{
    data: string
    zachmurzenie: number,
    faza_ksiezyca: number,
    rodzaj_opadu: number,
    gestosc_mgly: number,
}

interface IResponseMessage{
    message: string
}


export const useCallendarStore = defineStore('calendar', () => {
    const datesList = ref<ICalendarHeader[]>([])
    const calendarBody = ref<ICallendarBody>({
        data: date.formatDate(new Date(), "YYYY-MM-DD"),
        faza_ksiezyca: 1,
        gestosc_mgly: 0,
        rodzaj_opadu: 0,
        zachmurzenie: 0
    })
    const $q = useQuasar()    

    const reesetCalendarBody = () => {
        calendarBody.value.faza_ksiezyca = 1
        calendarBody.value.gestosc_mgly = 0
        calendarBody.value.rodzaj_opadu = 0
        calendarBody.value.zachmurzenie = 0
    }
    
    const dateListEventsFormat = computed(()=>{
        return datesList.value.map(e=>date.formatDate(e.data, "YYYY/MM/DD"))
    })
    const dateListArray = computed(()=>{
        return datesList.value.map(e=>e.data)
    })

    const getCallendarHeaders = async () =>{
        const {responseData, responseError} = await apiQuery<ICalendarHeader[]>("get", "calendar")
        if (responseData != undefined)
            datesList.value = responseData
        if (responseError != undefined){$q.notify(responseError)}
    }

    const getCallendarBody = async (date: string) => {
        const {responseData, responseError} = await apiQuery<ICallendarBody[]>("get", `calendar/${date}`)
        if (responseData != undefined)
            calendarBody.value = responseData[0]
        if (responseError != undefined){$q.notify(responseError)}
    }

    const insertCallendar = async () => {
        const {responseData, responseError} = await apiQuery<IResponseMessage>("put", `calendar/${calendarBody.value?.data}`,
        {
           clouds: calendarBody.value.zachmurzenie,
           moon: calendarBody.value.faza_ksiezyca,
           fall: calendarBody.value.rodzaj_opadu,
           fog: calendarBody.value.gestosc_mgly
        })
        if (responseError != undefined){$q.notify(responseError)}
        if (responseData != undefined)
            $q.notify({color: "positive", message: responseData.message})
        await getCallendarHeaders()
    }

    const updateCallendarCloudy = async () =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("patch", `calendar/${calendarBody.value?.data}/clouds`, {clouds: calendarBody.value.zachmurzenie})
        if (responseData != undefined)
            $q.notify({color: "positive", message: responseData.message})
        if (responseError != undefined){$q.notify(responseError)}
    }
    
    const updateCallendarFog = async () =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("patch", `calendar/${calendarBody.value?.data}/fog`, {fog: calendarBody.value.gestosc_mgly})
        if (responseData != undefined)
            $q.notify({color: "positive", message: responseData.message})
        if (responseError != undefined){$q.notify(responseError)}
        
    }
    const updateCallendarMoon = async () =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("patch", `calendar/${calendarBody.value?.data}/moon`, {moon: calendarBody.value.faza_ksiezyca})
        if (responseData != undefined)
            $q.notify({color: "positive", message: responseData.message})
        if (responseError != undefined){$q.notify(responseError)}
    }
    const updateCallendarFall = async () =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("patch", `calendar/${calendarBody.value?.data}/fall`, {fall: calendarBody.value.rodzaj_opadu})
        if (responseData != undefined)
            $q.notify({color: "positive", message: responseData.message})
        if (responseError != undefined){$q.notify(responseError)}
    }

    
    const updateCallendar = async () => {
        const cloudy = updateCallendarCloudy()
        const fog = updateCallendarFog()
        const moon = updateCallendarMoon()
        const fall = updateCallendarFall()
        await cloudy, fog, moon, fall
    }

    onMounted(getCallendarHeaders)
    
    return {
        datesList,
        dateListEventsFormat,
        dateListArray,
        calendarBody,
        reesetCalendarBody,
        getCallendarHeaders, 
        getCallendarBody,
        insertCallendar,
        updateCallendarCloudy,
        updateCallendarFog,
        updateCallendarMoon,
        updateCallendarFall,
        updateCallendar

    }
})