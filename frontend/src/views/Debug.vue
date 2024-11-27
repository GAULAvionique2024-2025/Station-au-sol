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
    <div>
        <MyConsole></MyConsole>
        <MyStatus></MyStatus>
    </div>
    
<!-- Ici, tout ce qui peut nous aider à debug.-->
</template>