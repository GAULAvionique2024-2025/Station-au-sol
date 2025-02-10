<script setup>
import MyMap from "../components/MyMap.vue";
import MyChart from "../components/MyChart.vue";
</script>

<template>
    <div class="grid">
      
      <MyChart></MyChart>
      <MyMap></MyMap>
    </div>
 
    <router-link to="/flight2" class="nav-button">Aller à la page 2</router-link>
</template>

<style scoped>

.nav-button {
  position: fixed;
  bottom: 40px;
  right: 70px;
  padding: 12px 20px;
  background-color: #b83524;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* ✅ Effet au survol */
.nav-button:hover {
  background-color: #dd473d;
  transform: scale(1.05);
}
</style>