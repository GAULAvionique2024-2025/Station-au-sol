<script setup>
import MyMap from "../components/MyMap.vue";
import MyChart from "../components/MyChart.vue";
import MyStatus from "../components/MyStatus.vue";
import MyThreeView from "../components/MyThreeView.vue";
import MyOther from "../components/MyOther.vue";
import MyConsole from "../components/MyConsole.vue";
</script>

<template>
  <div class="container">
    <div class="map">
      <MyMap></MyMap>
    </div>
    <div class = "chart">
      <MyChart></MyChart>
    </div>
    <div class = "status">
      <MyStatus></MyStatus>
    </div>
    <div class = "mythreeview">
      <MyThreeView></MyThreeView>
    </div>
    <div class ="other">
      <MyOther></MyOther>
    </div>
    <div class = "console">
      <MyConsole></MyConsole>
    </div>
  </div>
</template>
