<script setup>
import MyStatus from "../components/MyStatus.vue";
import MyThreeView from "../components/MyThreeView.vue";
import MyOther from "../components/MyOther.vue";
</script>

<template>
  <div class="page">
    <div class="full">
        <MyStatus></MyStatus>
        <MyOther></MyOther>
        <MyThreeView></MyThreeView>
    </div>
</div>
</template>

<style scoped>

.page{
  width: 90vw;
  height: 89vh;
  padding: 5px;
}


</style>
