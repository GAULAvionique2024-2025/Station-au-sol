<script>
    import MyConsole from "../components/MyConsole.vue";
    import MyStatus from "../components/MyStatus.vue";
  
    export default {
        components: {
            MyConsole,
            MyStatus,
        },
    };
</script>

<template>
    <div class="debug-container">
      <div class="console-container">
        <MyConsole />
      </div>
      <div class="status-container">
        <MyStatus />
      </div>
    </div>
  </template>
  
  <style lang="scss" scoped>
  
  .debug-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    height: 100vh;
  }
  
  .console-container {
    flex: 2;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .console-container #console-text {
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow-y: auto;
    padding: 10px;
    height: 100%;
  }
  
  .status-container {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }
  </style>
  