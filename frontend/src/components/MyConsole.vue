<!-- Component to display events of the application on the interface -->

<script setup>
import { useConsoleStore } from '@/stores/console';
import { storeToRefs } from 'pinia';
import { ref, watch, nextTick } from 'vue';

const consoleDiv = ref(null);
const { consoleText } = storeToRefs(useConsoleStore());

watch(consoleText.value, async () => {
  await nextTick(); // Wait for DOM to update
  consoleDiv.value.scrollTop = consoleDiv.value.scrollHeight; // Scroll to the bottom of the console
});
</script>

<template>
  <div id="console" class="component">
    <h5>CONSOLE</h5>
    <div id="console-text" ref="consoleDiv">
      <p v-for="text in consoleText" :key="text" v-html="text"></p>
    </div>
  </div>
</template>

<style lang="scss">
#console {
  display: grid;
  grid-template-rows: max-content 1fr;

  &>h5 {
    margin-bottom: 5px;
  }

  #console-text {
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow-y: scroll;
    padding: 5px 10px;

    p {
      margin: 0;
    }
  }
}
</style>