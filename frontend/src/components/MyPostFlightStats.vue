<script setup>
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data.js";
import PostFlight from "@/assets/img/icons/postFlight.svg";

const { maxAltitude, maxSpeed, maxAcceleration } = storeToRefs(useDataStore());
</script>

<template>
  <div class="post-flight-container">
    <PostFlight :class="postFlight" />
    <h1>Rapport de vol</h1>
    <div class="stats">
      <p><strong>Hauteur max :</strong> {{ maxAltitude }} m</p>
      <p><strong>Vitesse max :</strong> {{ maxSpeed }} km/h</p>
      <p><strong>Accélération max :</strong> {{ maxAcceleration }} m/s²</p>
    </div>
  </div>
</template>

<style scoped>
.post-flight-container {
  padding: 20px;
  text-align: center;
  color:firebrick;
  font:bold
}

.stats {
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #080808;
}
</style>
