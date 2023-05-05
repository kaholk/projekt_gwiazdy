<template>
    <q-page class="q-px-lg">
        <q-dialog v-model="starAddDailog">
            <q-card style="min-width: 40vh;">
                <q-card-section>
                    <q-input v-model="StarsStore.starBody.nazwa" label="Nazwa" />
                    <q-input v-model="StarsStore.starBody.opis" label="Opis" />
                    <q-input v-model="StarsStore.starBody.link_zdjecie" label="Link do zdjęcia" />
                    <q-input v-model="StarsStore.starBody.pozycja_x" label="Pozycja x" />
                    <q-input v-model="StarsStore.starBody.pozycja_y" label="Pozycja y" />
                    <q-checkbox v-model="StarsStore.starBody.status" :true-value="1" :false-value="0" label="Status" left-label/>
                </q-card-section>
                <q-card-actions>``
                    <q-btn color="primary" @click="starAddDailogSave">Dodaj gwiazde</q-btn>
                    <q-space />
                    <q-btn color="primary" @click="starAddDailog = false">Anuluj</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="starsDetailsDialog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    <q-img :src="StarsStore.starBody.link_zdjecie" style="height: 200px;" spinner-color="white">
                        <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-negative text-white">
                            Nie można załadować zdjęcia
                            </div>
                        </template>
                    </q-img>
                </q-card-section>
                <q-card-section>
                    <div class="row">
                        <div class="col-xs-12 col-md-2 text-accent">Nazwa</div>
                        <div class="col-xs-12 col-md-10">{{ StarsStore.starBody.nazwa }}</div>
                    </div>
                    <div class="row q-mt-sm">
                        <div class="col-xs-12 col-md-2 text-accent">Opis</div>
                        <div class="col-xs-12 col-md-10">{{ StarsStore.starBody.opis }}</div>
                    </div>
                    <div class="row q-mt-sm">
                        <div class="col-xs-12 col-md-2 text-accent">Pozycja</div>
                        <div class="col-xs-12 col-md-10">{{ StarsStore.starBody.pozycja_x }}, {{ StarsStore.starBody.pozycja_y }}</div>
                    </div>
                    <div class="row q-mt-sm">
                        <div class="col-xs-12 col-md-2 text-accent">Status gwiazdy</div>
                        <div class="col-xs-12 col-md-10" v-if="StarsStore.starBody.status == 1">Zapalaona</div>
                        <div class="col-xs-12 col-md-10" v-else>Zgaszona</div>
                    </div>
                    <div class="row q-mt-sm">
                        <div class="col-xs-12 col-md-2 text-accent">Konstelacje</div>
                        <div class="col-xs-12 col-md-10">
                            <span v-if="StarsStore.starBody.constellations.length == 0">Ta gwizda nie jest w zadnej konstelacji</span>
                            <span v-else v-for="constellation in StarsStore.starBody.constellations" class="texthover" v-text="`${constellation.nazwa}, `" @click="getConstelallationDetails(constellation.id)"/>
                        </div>
                        
                    </div>
                </q-card-section>
                <q-card-actions>
                    <q-btn color="primary" @click="starsEditDialog = true">Edytuj gwaizde</q-btn>
                    <q-btn color="primary" @click="starDeleteDailog = true">Usuń gwaizde</q-btn>
                    <q-btn color="primary" @click="manageConstellationsDialog = true">Konstelacje</q-btn>
                    <q-btn color="primary" @click="StarsStore.updateStarBodyStatus" v-if="StarsStore.starBody.status == 1">Zgaś gwizde</q-btn>
                    <q-btn color="primary" @click="StarsStore.updateStarBodyStatus" v-else>Zapal gwizde</q-btn>
                    <q-btn color="primary"  @click="starsDetailsDialog = false">Zamknij</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="starsEditDialog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    <q-input v-model="StarsStore.starBody.nazwa" label="Nazwa" />
                    <q-input v-model="StarsStore.starBody.opis" label="Opis" />
                    <q-input v-model="StarsStore.starBody.link_zdjecie" label="Link do zdjęcia" />
                    <q-input v-model="StarsStore.starBody.pozycja_x" label="Pozycja x" />
                    <q-input v-model="StarsStore.starBody.pozycja_y" label="Pozycja y" />
                    <div v-if="StarsStore.starBody.status == 0">
                        Status: Zgaszona
                        <q-btn color="primary" @click="StarsStore.updateStarBodyStatus">Zapal</q-btn>
                    </div>
                    <div v-else>
                        Status: Zapalona
                        <q-btn color="primary" @click="StarsStore.updateStarBodyStatus">Zgaś</q-btn>
                    </div>
                </q-card-section>
                <q-card-actions>
                    <q-btn color="positive" @click="starsEditDialogSave">Zapisz zmainy</q-btn>
                    <q-space />
                    <q-btn color="primary" @click="starsEditDialog = false">Zamknij</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="starDeleteDailog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    Czy na pewno chcesz usunąć gwiazdę "{{ StarsStore.starBody.nazwa }}" ?
                </q-card-section>
                <q-card-actions>
                    <q-btn color="positive" @click="starDeleteDailog = false">Anuluj</q-btn>
                    <q-space />
                    <q-btn color="negative" @click="starDeleteDialogSave">Usuń Gwiazde</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="constellationDetailsDialog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    <q-img :src="StarsStore.constellationBody.link_zdjecie" style="height: 200px;" loading="lazy" spinner-color="white">
                        <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-negative text-white">
                            Nie można załadować zdjęcia
                            </div>
                        </template>
                    </q-img>
                </q-card-section>
                <q-card-section>
                    <div class="row">
                        <div class="col-xs-12 col-md-2 text-accent">Nazwa</div>
                        <div class="col-xs-12 col-md-10">{{ StarsStore.constellationBody.nazwa }}</div>
                    </div>
                    <div class="row q-mt-sm">
                        <div class="col-xs-12 col-md-2 text-accent">Opis</div>
                        <div class="col-xs-12 col-md-10">{{ StarsStore.constellationBody.opis }}</div>
                    </div>
                    <div class="row q-mt-sm">
                        <div class="col-xs-12 col-md-2 text-accent">Gwiazdy</div>
                        <div class="col-xs-12 col-md-10">
                            <span v-for="star in StarsStore.constellationBody.stars" class="texthover" @click="getStarDetails(star.id)" v-text="`${star.nazwa}, `"/>
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions>
                    <q-btn color="primary" @click="editConstellation(StarsStore.constellationBody.id)">Edytuj Konstelacje</q-btn>
                    <q-btn color="primary" @click="manageStarsLoad(StarsStore.constellationBody.id)">Zarządzaj Gwiazdami</q-btn>
                    <q-btn color="primary" @click="constellationDeleteDialogLoad(StarsStore.constellationBody.id)">Usuń konstelacje</q-btn>
                </q-card-actions>
                <q-card-actions>
                    <q-btn color="primary" @click="StarsStore.changeStarStatusInConstellation(1)">Zapal gwiazdy</q-btn>
                    <q-btn color="primary" @click="StarsStore.changeStarStatusInConstellation(0)">Zgaś gwiazdy</q-btn>
                </q-card-actions>
                <q-card-actions>
                    <q-btn color="primary" @click="constellationDetailsDialog = false">Zamknij</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="constellationEditDialog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    <q-input v-model="StarsStore.constellationBody.nazwa" label="Nazwa" />
                    <q-input v-model="StarsStore.constellationBody.opis" label="Opis" />
                    <q-input v-model="StarsStore.constellationBody.link_zdjecie" label="Link do zdjęcia" />
                </q-card-section>
                <q-card-actions>
                    <q-btn color="primary" @click="editConstellationSave">Zapisz zmainy</q-btn>
                    <q-space/>
                    <q-btn color="primary" @click="constellationEditDialog = false">Anuluj</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>
        
        <q-dialog v-model="constellationAddDialog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    <q-input v-model="StarsStore.constellationBody.nazwa" label="Nazwa" />
                    <q-input v-model="StarsStore.constellationBody.opis" label="Opis" />
                    <q-input v-model="StarsStore.constellationBody.link_zdjecie" label="Link do zdjęcia" />
                </q-card-section>
                <q-card-actions>
                    <q-btn color="primary" @click="constellationAddDailogSave">Dodaj Konstelacje</q-btn>
                    <q-space />
                    <q-btn color="primary" @click="constellationAddDialog = false">Anuluj</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="constellationDeleteDailog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    Czy na pewno chcesz usunąć konstelacje "{{ StarsStore.constellationBody.nazwa }}" ?
                </q-card-section>
                <q-card-actions>
                    <q-btn color="positive" @click="constellationDeleteDailog = false">Anuluj</q-btn>
                    <q-space />
                    <q-btn color="negative" @click="constellationDeleteDailogSave">Usuń Konstelacje</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="manageStarsDialog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    <div>Gwaizdy w konstelacji</div>
                    <div v-if="StarsStore.constellationBody.stars.length == 0">
                        Ta konstelacja nie zawiera żadnych gwiazd
                    </div>
                    <div v-else v-for="star in StarsStore.constellationBody.stars">
                        {{ star.nazwa }}
                        <q-btn color="negative" flat @click="deleteStarFromConstellation(star.id)">Usuń z konstelacji</q-btn>
                    </div>
                </q-card-section>
                <q-card-section>
                    <div>Pozostałe gwiazdy</div>
                    <div v-for="star in StarsStore.starsNotInConstellation">
                        {{ star.nazwa }}
                        <q-btn color="positive" flat @click="addStarToConstellation(star.id)">Dodaj do konstelacji</q-btn>
                    </div>
                </q-card-section>
                <q-card-actions>
                    <q-space/>
                    <q-btn color="primary" @click="manageStarsDialog = false">Zamknij</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="manageConstellationsDialog">
            <q-card style="min-width: 40vw">
                <q-card-section>
                    <div>Przypisane konstelacje</div>
                    <div v-for="constelation in StarsStore.starBody.constellations">
                        {{ constelation.nazwa }}
                        <q-btn color="negative" flat @click="deleteConstellationFromStar(constelation.id)">Usuń z konstelacji</q-btn>
                    </div>
                </q-card-section>
                <q-card-section>
                    <div>Pozostałe konstelacje</div>
                    <div v-for="constelation in StarsStore.constelationsNotinStar">
                        {{ constelation.nazwa }}
                        <q-btn color="positive" flat @click="addConstellationToStar(constelation.id)">Dodaj do konstelacji</q-btn>
                    </div>
                </q-card-section>   
                <q-card-actions>
                    <q-btn color="primary" @click="manageConstellationsDialog = false">Zamknij</q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>
        <br>
        <div class="row wrap justify-between q-mb-md">
            <div class="col-xs-12 col-lg-6 q-pr-md">
                <div>
                    <span>Gwaizdy</span>
                    <q-btn color="positive" flat @click="starAddDailogLoad">Dodaj Gwiazde</q-btn>
                </div>
                <q-scroll-area style="height: 200px">
                    <q-expansion-item v-for="star in StarsStore.starsList" :caption="`${star.nazwa} (${star.pozycja_x}, ${star.pozycja_y})`" group="starsGroup" v-if="$q.screen.lt.md">
                        <div class="row wrap">
                            <!-- <div class="col-xs-12 col-md-2 col-lg-3">{{ star.nazwa }} ({{ star.pozycja_x }}, {{ star.pozycja_y }})</div> -->
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="StarsStore.markStar(star.id)">Pokaż</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="getStarDetails(star.id)">Informacje</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="manageConstelationsLoad(star.id)">Konstelacje</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-1"><q-btn color="primary" flat @click="editStar(star.id)">Edytuj</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-1"><q-btn color="negative" flat @click="starDeleteDialogLoad(star.id)">Usuń</q-btn></div>
                        </div>
                    </q-expansion-item>
                    <div class="row wrap" v-else v-for="star in StarsStore.starsList">
                        <div class="col-xs-12 col-md-3 col-lg-3">{{ star.nazwa }} ({{ star.pozycja_x }}, {{ star.pozycja_y }})</div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="StarsStore.markStar(star.id)">Pokaż</q-btn></div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="getStarDetails(star.id)">Informacje</q-btn></div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="manageConstelationsLoad(star.id)">Konstelacje</q-btn></div>
                        <div class="col-xs-6 col-md-1 col-lg-1"><q-btn color="primary" flat @click="editStar(star.id)">Edytuj</q-btn></div>
                        <div class="col-xs-6 col-md-1 col-lg-1"><q-btn color="negative" flat @click="starDeleteDialogLoad(star.id)">Usuń</q-btn></div>
                    </div>
                </q-scroll-area>
            </div>
            <div class="col-xs-12 col-lg-6">
                <div>
                    <span>Konsteleacje</span>
                    <q-btn color="positive" flat @click="constellationAddDailogLoad">Dodaj Konstelecje</q-btn>
                </div>
                <q-scroll-area style="height: 200px">
                    <q-expansion-item v-if="$q.screen.lt.md" v-for="constellation in StarsStore.constellationList" :caption="constellation.nazwa" group="constellationGroup">
                        <div class="row wrap">
                            <!-- <div class="col-xs-12 col-md-2 col-lg-2">{{ constellation.nazwa }}</div> -->
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="markConstellaton(constellation.id)">Pokaż</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="getConstelallationDetails(constellation.id)">Informacje</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="editConstellation(constellation.id)">Edytuj</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="manageStarsLoad(constellation.id)">Gwiazdy</q-btn></div>
                            <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="negative" flat @click="constellationDeleteDialogLoad(constellation.id)">Usuń</q-btn></div>      
                        </div>
                    </q-expansion-item>
                    <div class="row wrap" v-else v-for="constellation in StarsStore.constellationList">
                        <div class="col-xs-12 col-md-2 col-lg-2">{{ constellation.nazwa }}</div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="markConstellaton(constellation.id)">Pokaż</q-btn></div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="getConstelallationDetails(constellation.id)">Informacje</q-btn></div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="editConstellation(constellation.id)">Edytuj</q-btn></div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="primary" flat @click="manageStarsLoad(constellation.id)">Gwiazdy</q-btn></div>
                        <div class="col-xs-6 col-md-2 col-lg-2"><q-btn color="negative" flat @click="constellationDeleteDialogLoad(constellation.id)">Usuń</q-btn></div>                    
                    </div>
                </q-scroll-area>
            </div>
        </div>

        <q-scroll-area 
            style="height: 60vh; max-width: 100%;" 
            :bar-style="{backgroundColor: 'gray', opacity: '0.1', accentColor: 'green'}"
            :thumb-style="{borderRadius: '5px', backgroundColor: '#027be3', width: '15px', height: '10px', opacity: '0.75'}"
            ref="scrollSkyRef"
        >
            <div class="sky">
                <div class="lineRow" v-for="row in 39" :key="row" :style="{top: row*50+'px'}">
                    <span><span>{{row*50}}</span></span>
                </div>
                <div class="lineColumn" v-for="row in 39" :key="row" :style="{left: row*50+'px'}">
                    <span><span>{{row*50}}</span></span>
                </div>
                <q-icon 
                    :name="mdiStar" 
                    v-for="star in StarsStore.starsList" 
                    size="50px" 
                    class="star"
                    :class="{marked: star.marked, active: star.status == 1}"
                    :style="{ left: `${star.pozycja_x}px`, top: `${star.pozycja_y}px` }"
                    @click="getStarDetails(star.id)"
                />
            </div>
        </q-scroll-area>
    </q-page>
</template>
<script setup lang="ts">

import {ref} from "vue"
import { mdiStar } from "@quasar/extras/mdi-v7"
import { useStarsStore, IStarHeader } from "stores/stars-store"
import { QScrollArea } from "quasar"
import { storeToRefs } from "pinia"

const StarsStore = useStarsStore()
const {scrollSkyRef} = storeToRefs(StarsStore)


//vvvv - starDetailsDialog
const starsDetailsDialog = ref(false)

const getStarDetails = (starId:number) =>{
    StarsStore.markStar(starId)
    starsDetailsDialog.value = true
    StarsStore.getStarBody(starId)
}
//^^^^ - starDetailsDialog


//vvvv - starEditDialog
const starsEditDialog = ref(false)

const editStar = (starId: number) =>{
    StarsStore.markStar(starId)
    starsEditDialog.value = true
    StarsStore.getStarBody(starId)
}

const starsEditDialogSave = ()=>{
    StarsStore.updateStarBody()
}
//^^^^ - starEditDialog



//vvvv - starAddDailog
const starAddDailog = ref(false)

const starAddDailogLoad = ()=>{
    starAddDailog.value = true
    StarsStore.starBody = StarsStore.defaultStarBody
}

const starAddDailogSave = async ()=>{
    const resoult = await StarsStore.addStar()
    if(resoult){
        starAddDailog.value = false
    }
}
//^^^^ - starAddDailog


//vvvv - starDeleteDailog
const starDeleteDailog = ref(false)

const starDeleteDialogLoad = (starId: number)=>{
    StarsStore.getStarBody(starId)
    starDeleteDailog.value = true
}
const starDeleteDialogSave = async () =>{
    const deleted = await StarsStore.deleteStar()
    console.log("xd1")
    console.log(deleted)
    console.log("xd2")
    if(deleted){
        starDeleteDailog.value = false
        starsDetailsDialog.value = false
    }
}
//^^^^ - starDeleteDailog



const constellationDetailsDialog = ref(false)
const getConstelallationDetails = async (constellationId: number) =>{
    constellationDetailsDialog.value = true
    await StarsStore.getConstellationBody(constellationId)
    StarsStore.markStar(StarsStore.constellationBody.stars.map(e=>e.id))
}


const constellationEditDialog = ref(false)
const editConstellation = async (constellationId: number) =>{
    constellationEditDialog.value = true
    StarsStore.getConstellationBody(constellationId)
}
const editConstellationSave = async () =>{
    const resoult = await StarsStore.editConstellation()
    if (resoult){
        constellationEditDialog.value = false
    }
}

const constellationAddDialog = ref(false)
const constellationAddDailogLoad = () =>{
    StarsStore.constellationBody = StarsStore.defaultConstellationBody
    constellationAddDialog.value = true
}
const constellationAddDailogSave = async () =>{
    const resoult = await StarsStore.addConstellation()
    if (resoult){
        constellationAddDialog.value = false
    }
}


const constellationDeleteDailog = ref(false)
const constellationDeleteDialogLoad = async (constellationId: number) =>{
    StarsStore.getConstellationBody(constellationId)
    constellationDeleteDailog.value = true
}
const constellationDeleteDailogSave = async () =>{
    const resoult = await StarsStore.deleteConstellation()
    if(resoult){
        constellationDeleteDailog.value = false
        constellationDeleteDailog.value = false
    }
}

const manageStarsDialog = ref(false)
const manageStarsLoad = async (constellationId: number) =>{
    StarsStore.getConstellationBody(constellationId)
    manageStarsDialog.value = true
}
const addStarToConstellation = async (starId: number) =>{
    StarsStore.addStarToConstellation(starId)
}
const deleteStarFromConstellation = async (starId: number) =>{
    StarsStore.deleteStarFromConstellation(starId)
}


const manageConstellationsDialog = ref(false)
const manageConstelationsLoad = async (starId:number) =>{
    StarsStore.getStarBody(starId)
    manageConstellationsDialog.value = true
}
const addConstellationToStar = async (constellationId: number) =>{
    StarsStore.addConstelationToStar(constellationId)
}
const deleteConstellationFromStar = async (constellationId: number) =>{
    StarsStore.deleteConstelationFromStar(constellationId)
}

const markConstellaton = async (constellationId: number) =>{
    await StarsStore.getConstellationBody(constellationId)
    StarsStore.markStar(StarsStore.constellationBody.stars.map(e=>e.id))
}






</script>
<style scoped lang="scss">
.sky{
    background-color: #0b0311;
    width: 2000px;
    height: 2000px;
    position: relative;
}
.star{
    position: absolute;
    color: white;

    &:hover{
        color: #00ff80 !important;
        cursor: pointer;
    }

    &.marked{
        // color: blueviolet;
        border: 2px solid green;
    }

    &.active{
        color: yellow;
    }
}

.lineRow{
    background-color: gray;
    position: absolute;
    width: 2000px;
    height: 1px;

    & > span{
        position: sticky;
        left: 0px;
    }

    & > span > span{
        position: relative;
        font-size: 12px;
        top: -16px;
        left: 0px;
        color: gray;
    }
}

.lineColumn{
    background-color: gray;
    position: absolute;
    width: 1px;
    height: 2000px;

    & > span {
        position: sticky;
        top: 0px;
    }

    & > span > span{
        position: relative;
        font-size: 12px;
        left: 5px;
        color: gray;
        display: block;
    }

}

.texthover{
    color: $secondary;
    &:hover{
        cursor: pointer;
        color: $accent;
    }
}
 
</style>