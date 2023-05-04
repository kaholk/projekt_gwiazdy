import { type } from 'os';
import { defineStore } from 'pinia';
import { QScrollArea, useQuasar } from 'quasar';
import { api, apiQuery } from 'src/boot/axios';
import { VNodeRef, onMounted, ref, computed } from "vue"



//vvvv - gwiazdy

interface IApiResponeStarHeader{
    id: number,
    nazwa: string,
    status: 1 | 0,
    pozycja_x: number,
    pozycja_y: number
}

interface IStarHeader extends IApiResponeStarHeader{
    marked: boolean
}

interface IStarShorHeader{
    id: number,
    nazwa: string,
}

interface IApiResponseStarBody extends IApiResponeStarHeader{
    link_zdjecie: string,
    opis: string,
}

interface IStarBody extends IApiResponseStarBody{
    constellations: IConstellationHeader[]
}

interface IApiUpdateStarBody{
    name: string,
    description: string,
    photo_link: string,
    position_x : number,
    position_y: number
}

interface IApiResponseUpdateStatus{
    status: 0 | 1
}
//^^^^ - gwiazdy



//vvvv - konstelacje
interface IApiResponseConstellationHeader{
    id: number,
    nazwa: string
}

interface IConstellationHeader extends IApiResponseConstellationHeader{
}

interface IApiResponseConstellationBody extends IApiResponseConstellationHeader{
    opis: string,
    link_zdjecie: string
}

interface IConstellationBody extends IApiResponseConstellationBody{
    stars: IStarShorHeader[]
}

interface IApiUpdateConstellationBody{
    name: string,
    description: string,
    photo_link: string
}
//^^^^ - konstelacje

interface IResponseMessage{
    message: string
}


export type {IStarHeader, IStarBody, IConstellationHeader, IConstellationBody}

export const useStarsStore = defineStore('stars', () => {
    const $q = useQuasar()   

    const scrollSkyRef = ref<QScrollArea>()


    //vvvv - gwiazdy
    const defaultStarBody:IStarBody = {
        id: 0,
        link_zdjecie: "",
        nazwa: "",
        opis: "",
        status: 0,
        pozycja_x: 0,
        pozycja_y: 0,
        constellations: []
    }

    const starsList = ref<IStarHeader[]>([])
    const starBody = ref<IStarBody>(defaultStarBody)

    const getStarsHeaders = async () =>{
        const {responseData, responseError} = await apiQuery<IApiResponeStarHeader[]>("get", `stars/`)
        if (responseData != undefined){
            starsList.value = responseData.map(e=>({...e, marked: false}))
        }
        if (responseError != undefined){$q.notify(responseError)}
        
    }

    const getStarBody = async (starId: number) =>{
        if(starBody.value.id == starId)
            return;
        const {responseData, responseError} = await apiQuery<IApiResponseStarBody[]>("get", `stars/${starId}`)
        const {responseData: responseData2, responseError: responseError2} = await apiQuery<IApiResponseConstellationHeader[]>("get", `stars/${starId}/constellation`)
        
        let constellations:IApiResponseConstellationHeader[] = []
        if(responseData2 != undefined)
            constellations = responseData2

        if (responseData != undefined)
            starBody.value = {
                ...responseData[0],
                constellations: constellations
            }
        if (responseError != undefined){$q.notify(responseError)}
    }
    

    const updateStarBody = async () =>{
        let payload: IApiUpdateStarBody = {
            description: starBody.value.opis,
            name: starBody.value.nazwa,
            photo_link: starBody.value.link_zdjecie,
            position_x: starBody.value.pozycja_x,
            position_y: starBody.value.pozycja_y
        }

        const {responseData, responseError} = await apiQuery<IResponseMessage>("patch", `stars/${starBody.value.id}`, payload)
        if (responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            const star =  starsList.value.find(e=>e.id == starBody.value.id)
            if(star != undefined){
                star.nazwa = starBody.value.nazwa
                star.pozycja_x = starBody.value.pozycja_x
                star.pozycja_y = starBody.value.pozycja_y
                // star.status = starBody.value.status
            }
            await markStar(starBody.value.id)
        }
        if (responseError != undefined){$q.notify(responseError)}
    }

    const updateStarBodyStatus = async () =>{
        const {responseData, responseError} = await apiQuery<IApiResponseUpdateStatus[]>("post", `stars/${starBody.value.id}/toggle`)
        if (responseData != undefined){
            starBody.value.status = responseData[0].status
            const star = starsList.value.find(e=>e.id == starBody.value.id)
            if(star != undefined){
                star.status = responseData[0].status
            }
        }
        if (responseError != undefined){$q.notify(responseError)}

    }

    const addStar = async () =>{
        let payload:IApiUpdateStarBody = {
            description: starBody.value.opis,
            name: starBody.value.nazwa,
            photo_link: starBody.value.link_zdjecie,
            position_x: starBody.value.pozycja_x,
            position_y: starBody.value.pozycja_y
        }
        const {responseData, responseError} = await apiQuery<IResponseMessage>("put", `stars`, payload)
        if (responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            getStarsHeaders()
            return true
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
            return false
        }

    }

    const deleteStar = async () =>{
        const response = await apiQuery<IResponseMessage>("delete", `stars/${starBody.value.id}`)
        const {responseData, responseError} = response

        if (responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            starsList.value = starsList.value.filter(e=>e.id != starBody.value.id)
            starBody.value = defaultStarBody
            return true
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
            return false
        }
    }

    const clearStarsMark = () =>{
        starsList.value.forEach(e => {
            e.marked = false
        });
    }

    const markStar = (starId: number | number[]) =>{
        clearStarsMark()
        let starIdlist:number[] = []

        if(Array.isArray(starId)) starIdlist = starId
        else starIdlist.push(starId)

        starsList.value.filter(e=> starIdlist.includes(e.id)).forEach(e=> e.marked = true)

        const minX = Math.min(...starsList.value.filter(e=>starIdlist.includes(e.id)).map(e=>e.pozycja_x)) 
        const minY = Math.min(...starsList.value.filter(e=>starIdlist.includes(e.id)).map(e=>e.pozycja_y)) 

        if( minX != Infinity  && minY != Infinity){
            scrollSkyRef!.value!.setScrollPosition('horizontal', minX-50, 200)
            scrollSkyRef!.value!.setScrollPosition('vertical', minY-50, 200)
        }

    }
    //^^^^ - gwiazdy


    //vvvv - konstelacje
    const defaultConstellationBody:IConstellationBody = {
        id: 0,
        link_zdjecie: "",
        nazwa: "",
        opis: "",
        stars: []
    }
   
    const constellationList = ref<IConstellationHeader[]>([])
    const constellationBody = ref<IConstellationBody>(defaultConstellationBody)


    const getConstellationsHeaders = async () =>{
        const {responseData, responseError} = await apiQuery<IApiResponseConstellationHeader[]>("get", `constellations/`)
        if (responseData != undefined){            
            constellationList.value = responseData
        }
        if (responseError != undefined){$q.notify(responseError)}
    }

    const getConstellationBody = async (constellationId: number) =>{
        if(constellationBody.value.id == constellationId){
            return;
        }


        const {responseData, responseError} = await apiQuery<IApiResponseConstellationBody[]>("get", `constellations/${constellationId}`)
        const {responseData: responseData2, responseError: responseError2} = await apiQuery<IApiResponeStarHeader[]>("get", `constellations/${constellationId}/stars`)

        if (responseData != undefined){
            let stars:IApiResponeStarHeader[] = []
            if (responseData2 != undefined){
                stars = responseData2
                //stars = starsList.value.filter(e=>responseData2.map(e=>e.id).includes(e.id))
                
            }

            constellationBody.value = {...responseData[0], stars: stars}
        }
    }

    const addConstellation = async () =>{
        let payload:IApiUpdateConstellationBody = {
            description: constellationBody.value.opis,
            name: constellationBody.value.nazwa,
            photo_link: constellationBody.value.opis
        }

        const {responseData, responseError} = await apiQuery<IResponseMessage>("put", `constellations`, payload)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            getConstellationsHeaders()
            return true
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
            return false
        }
    }

    const editConstellation = async () =>{
        let payload:IApiUpdateConstellationBody = {
            description: constellationBody.value.opis,
            name: constellationBody.value.nazwa,
            photo_link: constellationBody.value.opis
        }
        const {responseData, responseError} = await apiQuery<IResponseMessage>("patch", `constellations/${constellationBody.value.id}`, payload)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            const constellation = constellationList.value.find(e=>e.id == constellationBody.value.id)
            if(constellation != undefined){
                constellation.nazwa = constellationBody.value.nazwa
            }
            
            return true
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
            return false
        }
    }

    const deleteConstellation = async () =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("delete", `constellations/${constellationBody.value.id}`)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            constellationList.value = constellationList.value.filter(e=>e.id != constellationBody.value.id)
            return true
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
            return false
        }
    }

    const starsNotInConstellation = computed(()=>{
        return starsList.value.filter(e=>!constellationBody.value.stars.map(e=>e.id).includes(e.id))
    })

    const constelationsNotinStar = computed(()=>{
        return constellationList.value.filter(e=>!starBody.value.constellations.map(e=>e.id).includes(e.id))
    })

    const addStarToConstellation = async (starId:number) =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("put", `constellations/${constellationBody.value.id}/${starId}`)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            const star = starsList.value.find(e=>e.id == starId)

            starBody.value.constellations.push({
                id: constellationBody.value.id,
                nazwa: constellationBody.value.nazwa
            })
            if (star != undefined){
                constellationBody.value.stars.push({
                    id: star.id,
                    nazwa: star.nazwa,
                })
            }
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
        }
    }

    const deleteStarFromConstellation = async (starId:number) =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("delete", `constellations/${constellationBody.value.id}/${starId}`)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            constellationBody.value.stars = constellationBody.value.stars.filter(e=>e.id != starId)
            starBody.value.constellations = starBody.value.constellations.filter(e=>e.id != constellationBody.value.id)
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
        }
    }

    const addConstelationToStar = async (constellationId: number) =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("put", `constellations/${constellationId}/${starBody.value.id}`)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})

            const constellation = constellationList.value.find(e=>e.id==constellationId)
            constellationBody.value.stars.push({
                id: starBody.value.id,
                nazwa: starBody.value.nazwa
            })
            if(constellation != undefined){
                starBody.value.constellations.push({
                    id: constellation.id,
                    nazwa: constellation.nazwa
                })
            }
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
        }
    }

    const deleteConstelationFromStar = async (constellationId: number) =>{
        const {responseData, responseError} = await apiQuery<IResponseMessage>("delete", `constellations/${constellationId}/${starBody.value.id}`)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            starBody.value.constellations = starBody.value.constellations.filter(e=>e.id != constellationId)
            constellationBody.value.stars = constellationBody.value.stars.filter(e=>e.id != starBody.value.id)
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
        }
    }

    const changeStarStatusInConstellation = async (status: 1 | 0) => {
        const {responseData, responseError} = await apiQuery<IResponseMessage>("post", `constellations/${constellationBody.value.id}/${status}/setAll`)
        if(responseData != undefined){
            $q.notify({color: "positive", message: responseData.message})
            const starsIds = constellationBody.value.stars.map(e=>e.id)
            starsList.value.filter(e=>starsIds.includes(e.id)).forEach(e=>{
                e.status = status
            })
        }
        else{
            if (responseError != undefined){$q.notify(responseError)}
        }
    }

    onMounted(()=>{
        getStarsHeaders()
        getConstellationsHeaders()
    })
    return {

        scrollSkyRef,

        //vvvv - gwiazdy
        starsList,
        starBody,
        defaultStarBody,
        markStar,
        getStarsHeaders,
        getStarBody,
        updateStarBody,
        updateStarBodyStatus,
        addStar,
        deleteStar,
        clearStarsMark,
        //^^^^ - gwiazdy

        //vvvv - konstelacje
        constellationList,
        constellationBody,
        defaultConstellationBody,
        getConstellationsHeaders,
        getConstellationBody,
        addConstellation,
        editConstellation,
        deleteConstellation,
        changeStarStatusInConstellation,
        //^^^^ - konstelacje

        starsNotInConstellation,
        constelationsNotinStar,
        addStarToConstellation,
        deleteStarFromConstellation,
        addConstelationToStar,
        deleteConstelationFromStar,
        

    }

})