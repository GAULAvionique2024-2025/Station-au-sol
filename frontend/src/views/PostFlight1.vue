<script>
    import MyPostFlightStats from "@/components/MyPostFlightStats.vue";
    import MyMap from "../components/MyMap.vue";

    export default {
        components: {
            MyMap,
            MyPostFlightStats
        },
    };
</script>

<template>
    <div style="height:100vh">
        <div style="height:45vh"><MyPostFlightStats></MyPostFlightStats></div>
        <div style="height:45vh"><MyMap></MyMap></div>
    </div>
</template>
<!-- où est la fusée? la pinpoint. 
 Pourrait être intéressant d'ajouter des stats comme hauteur max atteinte, vitesse etc-->

