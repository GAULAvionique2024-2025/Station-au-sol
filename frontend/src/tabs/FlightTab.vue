<script>
    import MyChart from "../components/MyChart.vue";
    import MyThreeView from "../components/MyThreeView.vue";
    import MyOther from "../components/MyOther.vue";
  
    export default {
        components: {
            MyChart,
            MyThreeView,
            MyOther,
        },
    };
</script>

<template>
    <div>
        <div class="grid">
            <MyChart></MyChart>
            <MyThreeView></MyThreeView>
            <MyOther></MyOther>
        </div>
    </div>
</template>
  