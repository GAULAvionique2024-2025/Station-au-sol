<script setup>
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const consoleDiv = ref(null);
const { consoleText } = storeToRefs(useDataStore());

watch(consoleText.value, () => {
  if (consoleText.value.length === 0) return;

  const p = document.createElement('p');
  p.innerHTML = consoleText.value.splice(-1);
  consoleDiv.value.appendChild(p);

  // consoleDiv.value.lastElementChild.scrollIntoView();
  consoleDiv.value.scrollTop = consoleDiv.value.scrollHeight;
});
</script>

<template>
  <div id="console" class="component">
    <h5>CONSOLE</h5>
    <div id="console-text" ref="consoleDiv">
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