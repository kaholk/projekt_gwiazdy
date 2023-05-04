<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="mdi-menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
        </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Gwaizdy
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { mdiCalendar, mdiStarShooting } from "@quasar/extras/mdi-v7"

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Wybierz Date',
    caption: '',
    icon: mdiCalendar,
    link: '/'
  },
  {
    title: 'Edycja Nieba',
    caption: '',
    icon: mdiStarShooting,
    link: 'stars'
  },
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
