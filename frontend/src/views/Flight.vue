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
      
      <MyChart></MyChart>
      <MyMap></MyMap>
    </div>
 
    <router-link to="/flight2" class="nav-button">Aller à Flight 2</router-link>
</template>
