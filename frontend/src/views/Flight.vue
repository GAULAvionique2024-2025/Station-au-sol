<script setup>
import MyMap from "../components/MyMap.vue";
import MyChart from "../components/MyChart.vue";
import MyStatus from "../components/MyStatus.vue";
import MyThreeView from "../components/MyThreeView.vue";
import MyOther from "../components/MyOther.vue";
import MyConsole from "../components/MyConsole.vue";
</script>

<template>
  <div class="grid">
    <MyMap></MyMap>
    <MyChart :class="{ 'small-chart': $route.path !== '/chart' }"></MyChart>
    <MyStatus></MyStatus>
    <MyThreeView></MyThreeView>
    <MyOther></MyOther>
    <MyConsole></MyConsole>
  </div>
</template>

<style scoped>
.small-chart {
  width: 10%;
  max-height: 10px;
}
</style>
