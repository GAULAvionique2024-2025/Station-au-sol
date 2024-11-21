<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div>
    <RouterLink to="/debug">Go to Debug</RouterLink>
    <RouterLink to="/bluetooth">Go to Bluetooth</RouterLink>
    <RouterLink to="/preflight1">Go to PreFlight1</RouterLink>
    <RouterLink to="/preflight2">Go to PreFlight2</RouterLink>
    <RouterLink to="/flight">Go to Flight</RouterLink>
    <RouterLink to="/postflight1">Go to PostFlight1</RouterLink>
    <RouterLink to="/postflight2">Go to PostFlight2</RouterLink>
  </div>
</template>

<style scoped>
div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
</style>
