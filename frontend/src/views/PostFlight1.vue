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
    <div>
        <div class = 'full' >
            <MyPostFlightStats></MyPostFlightStats>
            <MyMap></MyMap>
            </div>
        </div>
</template>
<!-- où est la fusée? la pinpoint. 
 Pourrait être intéressant d'ajouter des stats comme hauteur max atteinte, vitesse etc-->

