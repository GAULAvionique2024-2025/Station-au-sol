<script>
    import MyChart from "../components/MyChart.vue";
    import MyStatus from "../components/MyStatus.vue";
    import MyThreeView from "../components/MyThreeView.vue";
    import MyOther from "../components/MyOther.vue";
  
    export default {
        components: {
            MyChart,
            MyStatus,
            MyThreeView,
            MyOther,
        },
    };
</script>

<template>
    <div>
        <div class="grid">
            <MyChart></MyChart>
            <MyStatus></MyStatus>
            <MyThreeView></MyThreeView>
            <MyOther></MyOther>
        </div>
    </div>
</template>
  