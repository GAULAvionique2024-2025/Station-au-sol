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

<style lang="scss">
@use "@/assets/scss/variables" as *;

.grid {
  display: grid;
  height: calc(100vh - $header-height);
  min-height: calc($component-min-height * 3);
}

.double {
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: 100%;
}

@media screen and (min-width: 0px) and (max-width: calc($layout-breakpoint-sm - 0.2px)) {
  .grid {
    grid-template-areas:
      "map"
      "chart"
      "status"
      "angle"
      "other"
      "console";
  }

  .double {
    grid-template-columns: 100%;
    grid-template-rows: 40% 60%;
    min-height: calc($component-min-height * 1.875) !important;
  }
}

@media screen and (min-width: $layout-breakpoint-sm) and (max-width: calc($layout-breakpoint-md - 0.2px)) {
  .grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas:
      "map status"
      "chart chart"
      "angle angle"
      "other console";
  }
}

@media screen and (min-width: $layout-breakpoint-md) {
  .grid {
    grid-template-columns: 1fr 2fr;
    grid-template-rows: repeat(3, 1fr);
    grid-template-areas:
      "map chart"
      "status angle"
      "other console";
  }
}

#map {
  grid-area: map;
}

#chart {
  grid-area: chart;
}

#status {
  grid-area: status;
}

#angle {
  grid-area: angle;
}

#other {
  grid-area: other;
}

#console {
  grid-area: console;
}
</style>
