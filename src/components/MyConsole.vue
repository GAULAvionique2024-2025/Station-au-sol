<script setup>

</script>

<template>
  <div id="console" class="component">
    <h5>CONSOLE</h5>
    <div id="console-text"></div>
  </div>
</template>

<style lang="scss" scoped>
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