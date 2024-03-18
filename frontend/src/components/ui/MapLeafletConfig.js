import { polyline as Lpolyline, map as Lmap, tileLayer as LtileLayer, icon as Licon, marker as Lmarker, layerGroup as LlayerGroup } from 'leaflet';


const myIcons = {
    rocket: Licon({
        iconUrl: '/img/rocket.svg',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    }),
    userPos: Licon({
        iconUrl: '/img/user_pos.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8],
    }),
    launchpad: Licon({
        iconUrl: '/img/launchpad.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    })
}


const LAUNCH_CANADA_LL = [47.9868850, -81.8484030]
const SPACEPORT_AMERICA_LL = [32.98950, -106.97509]

const myMarkers = {
    rocket: Lmarker([0, 0], { icon: myIcons.rocket }).bindPopup("<b>Rocket position</b>"),
    userPos: Lmarker([0, 0], { icon: myIcons.userPos }).bindPopup("<b>You're here</b>"),
    launchCanada: Lmarker(LAUNCH_CANADA_LL, { icon: myIcons.launchpad }).bindPopup("<b>Launch Canada !</b>"),
    spacePortAmerica: Lmarker(SPACEPORT_AMERICA_LL, { icon: myIcons.launchpad }).bindPopup("<b>Spaceport America !</b>"),
};

const myLaunchpadsLayer = LlayerGroup([myMarkers.launchCanada, myMarkers.spacePortAmerica])


const myPolyline = Lpolyline([], { color: 'grey' });


const myLocalTiles = LtileLayer('/tiles/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const myOnlineTiles = LtileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

export { myIcons, myMarkers, myLaunchpadsLayer, myPolyline, myLocalTiles, myOnlineTiles };