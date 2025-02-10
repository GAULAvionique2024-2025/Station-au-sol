import { createRouter, createWebHashHistory } from "vue-router";

import PageSelection from "./views/PageSelection.vue";
import Debug from "./views/Debug.vue";
import Bluetooth from "./views/Bluetooth.vue";
import PreFlight1 from "./views/PreFlight1.vue";
import PreFlight2 from "./views/PreFlight2.vue";
import Flight from "./views/Flight.vue";
import Flight2 from "./views/Flight2.vue";
import PostFlight1 from "./views/PostFlight1.vue";
import PostFlight2 from "./views/PostFlight2.vue";
import Chart from "./views/Chart.vue";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: PageSelection },
        { path: "/debug", component: Debug },
        { path: "/bluetooth", component: Bluetooth },
        { path: "/preflight1", component: PreFlight1 },
        { path: "/preflight2", component: PreFlight2 },
        { path: "/flight", component: Flight },
        {path:"/flight2", component: Flight2},
        { path: "/postflight1", component: PostFlight1 },
        { path: "/postflight2", component: PostFlight2 },
        {path: "/chart", component: Chart},
    ],
});
