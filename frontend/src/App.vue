<script setup>
import Header from "./components/shared/Header.vue";
import Settings from "./components/shared/Settings.vue";
import MyMap from "./components/MyMap.vue";
import MyChart from "./components/MyChart.vue";
import MyStatus from "./components/MyStatus.vue";
import MyThreeView from "./components/MyThreeView.vue";
import MyOther from "./components/MyOther.vue";
import MyConsole from "./components/MyConsole.vue";

import { useUiStore } from "./stores/ui";

const ui = useUiStore();
</script>

<template>
  <div :class="{ 'settings-opened': ui.showSettings, expanded: ui.expanded }">
    <Header></Header>
    <main>
      <div class="grid">
        <MyMap></MyMap>
        <MyChart></MyChart>
        <MyStatus></MyStatus>
        <MyThreeView></MyThreeView>
        <MyOther></MyOther>
        <MyConsole></MyConsole>
      </div>

      <Settings></Settings>
    </main>
  </div>
</template>

<style scoped></style>
