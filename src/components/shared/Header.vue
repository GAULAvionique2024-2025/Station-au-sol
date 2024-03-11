<script setup>
// Pause btn
// Expand btn
// Reset btn
// Settings btn
</script>

<template>
  <header>
    <!-- Main Header -->
    <div id="top-header" class="d-flex justify-content-between">
      <!-- Logo + Title -->
      <div class="d-flex align-items-center">
        <img id="logo-gaul" src="../../assets/img/logo-gaul.svg" alt="Logo GAUL" width="100" height="24" />
        <h1 class="text-white d-sm">Ground station</h1>
      </div>

      <!-- Options -->
      <nav>
        <div class="d-flex align-items-center h-100">
          <!-- Buttons -->
          <div id="header-options" class="d-md align-items-center h-100">
            <a class="btn btn-link" href="./simple.html">Simple</a>
            <button class="btn btn-secondary" data-btn="reset">
              Reset
            </button>
            <button class="btn btn-danger btn-pause" data-btn="pause">
              Pause
            </button>
            <button class="btn btn-icon">
              <img src="../../assets/img/settings.svg" alt="Settings Icon" height="36" width="36" data-btn="settings" />
            </button>
          </div>

          <!-- Small screen btn -->
          <button class="h-md btn btn-icon mx-1" data-btn="expand">
            <img id="expand-ico" src="../../assets/img/expand.svg" alt="Expand Icon" height="36" width="36" />
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.d-flex {
  display: flex !important;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.h-100 {
  height: 100%;
}
</style>