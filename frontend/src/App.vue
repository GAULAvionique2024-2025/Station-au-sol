<script setup>
import Header from "./components/shared/Header.vue";
import Settings from "./components/shared/Settings.vue";
import Tabs from "./views/Tabs.vue"

import { useUiStore } from "./stores/ui";

const ui = useUiStore();
</script>

<template>
  <div :class="{ 'settings-opened': ui.showSettings, expanded: ui.expanded }">
    <Header></Header>
    <main>
      <Tabs></Tabs>
      <Settings></Settings>
    </main>
  </div>
</template>

<style scoped></style>
