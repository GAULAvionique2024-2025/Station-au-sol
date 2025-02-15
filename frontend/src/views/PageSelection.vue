<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="router-links">
    <a><RouterLink to="/debug">Go to Debug</RouterLink></a>
    <a><RouterLink to="/bluetooth">Go to Bluetooth</RouterLink></a>
    <a><RouterLink to="/preflight1">Go to PreFlight1</RouterLink></a>
    <a><RouterLink to="/preflight2">Go to PreFlight2</RouterLink></a>
    <a> <RouterLink to="/flight">Go to Flight</RouterLink></a>
    <a><RouterLink to="/postflight1">Go to PostFlight1</RouterLink></a>
    <a><RouterLink to="/postflight2">Go to PostFlight2</RouterLink></a>
    <a><RouterLink to="/chart"> Go to Chart</RouterLink></a>
  </div>
  <div class="welcome-msg">
    <h2>Bienvenue à la station au sol du GAUL.</h2>
    <p> Description du fonctionnement du site. Ici toutes les infos nécessaires à la compréhension et à la navigation de la SAS seront écrites.</p>
    <img src="https://www.fsg.ulaval.ca/fileadmin/_processed_/9/4/csm_GAUL_2024-06-26__2__8a3beed4da.jpg" alt="Le GAUL"  width="100%" height="70%"/>
  </div>
</template>

<style scoped>
div{
  margin-top: 1rem;
  margin-left: 0.75rem;
  margin-bottom: 1rem;
  gap: 1.5rem;
  float: left;
}

a {
  color: rgb(255, 255, 255);
  text-decoration: none;
  background-color:  rgb(200, 40, 55);
  border-radius: 0.375rem;
  text-align:center;
  vertical-align:middle;
  padding: 0.375rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
}

p{
  font-size: medium;
}

.welcome-msg{
  display: block;
  position: absolute;
  top: 60px;
  left: 250px;
  right: 10px;
  bottom: 20px;
  padding: 0.375rem 0.75rem;
  border:2px;
  border-style: solid;
  border-color: black;
  border-radius: 0.375rem;
}


.router-links{
  display:grid;
  padding: 0.375rem 0.75rem;
  justify-content: space-between;
}
</style>
