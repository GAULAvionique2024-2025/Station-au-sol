<script>
    import MyChart from "@/components/MyChart.vue";
  
    export default {
        components: {
            MyChart,
        },
    };
</script>
<template>
    <div class="chart-container">
        <MyChart></MyChart>
    </div>
</template>

<style>
.chart-container{
    display: flex;
    justify-content: center;
    width:1300px;
    height:600px;
}
</style>
