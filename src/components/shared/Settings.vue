<script setup>

</script>

<template>
  <div class="settings">
    <div class="settings-container">
      <div class="settings-closer" data-btn="settings-closer"></div>
      <div class="settings-box">
        <div class="settings-header">
          <h3>Settings</h3>
          <button class="btn btn-icon">
            <img src="../../assets/img/close.svg" alt="Close Icon" height="36" width="36" data-btn="settings-closer" />
          </button>
        </div>
        <div class="settings-content">
          <div class="serial-port">
            <label>Serial port:</label>
            <select id="available-paths">
              <option value="...">...</option>
            </select>
          </div>
          <div class="download-csv">
            <button class="btn btn-secondary" data-btn="download-csv">Download CSV</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>