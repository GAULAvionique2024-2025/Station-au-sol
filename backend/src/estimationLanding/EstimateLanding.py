from matplotlib import pyplot as plt

from backend.src.estimationLanding.dataObject import FlightData
from backend.src.estimationLanding.utility.distanceBetweenTwoPoints import distanceBetweenTwoPoints


class EstimateLanding:
    def __init__(self, flightData: FlightData):
        self.flightData = flightData
        self.cleanData()
        self.posInitial = (0, 0)

    def estimateLandingPosition(self):
        deltaAltitude = self.estimateLinearFormulas()
        lastAltitudesValue = self.flightData.altitudes[len(self.flightData.altitudes)-1]

        plt.figure(figsize=(8, 6))
        plt.plot(self.flightData.longitudes, self.flightData.latitudes, marker='o', linestyle='-', color='b', label='Flight Path')
        plt.title('Flight Path (Latitudes vs Longitudes)')
        plt.xlabel('Longitude')
        plt.ylabel('Latitude')
        plt.grid(True)
        plt.legend()
        plt.show()

        plt.figure(figsize=(8, 6))
        plt.plot(self.flightData.times, self.flightData.altitudes, marker='o', linestyle='-', color='b', label=' Altitude rocket')
        plt.title('Altitude')
        plt.xlabel('Times')
        plt.ylabel('Altitudes')
        plt.grid(True)
        plt.legend()
        plt.show()

        plt.figure(figsize=(8, 6))
        plt.plot(self.flightData.times[-40:], deltaAltitude[-40:], marker='o', linestyle='-', color='b', label=' Altitude rocket')
        plt.title('Altitude')
        plt.xlabel('Times')
        plt.ylabel('Altitudes')
        plt.grid(True)
        plt.legend()
        plt.show()

        return 0
    def estimateLinearFormulas(self):
        mList = []
        longDeltaList = []
        self.posInitial = (self.flightData.latitudes[0], self.flightData.longitudes[0])
        distanceX = 0
        distanceY = 0

        for id, altitude in enumerate(self.flightData.altitudes):
            if id != 0 and id != len(self.flightData.altitudes):
                deltaTime = self.flightData.times[id] - self.flightData.times[id-1]
                deltaAltitude = altitude - self.flightData.altitudes[id-1]
                deltaLong = self.flightData.longitudes[id] - self.flightData.longitudes[id-1]
                deltaLat = self.flightData.latitudes[id] - self.flightData.latitudes[id-1]

                pos1 = (self.flightData.latitudes[id], self.flightData.longitudes[id])
                pos2 = (self.flightData.latitudes[id-1], self.flightData.longitudes[id-1])

                distanceXY = distanceBetweenTwoPoints(pos1, pos2)
                distanceX += distanceXY[0]
                distanceY += distanceXY[1]

                m = deltaAltitude/deltaTime
                mList.append(m)

        print(sum(mList[-40:]) / len(mList[-40:]))
        #TODO comment identifier les deux pentes
        # de préférences ont n'aurait pas à se fier à la fusée

        print("drift X à partir de l'apogée(km) : ")
        print(distanceX)
        print("drift Y à partir de l'apogée(km) : ")
        print(distanceY)
        return mList[-40:]
    def cleanData(self):
        altitudeMax = 0
        idMax = 0
        for idx, altitude in enumerate(self.flightData.altitudes):
            if altitude >= altitudeMax:
                altitudeMax = altitude
                idMax = idx

        self.flightData.times = self.flightData.times[idMax:]
        self.flightData.altitudes = self.flightData.altitudes[idMax:]
        self.flightData.latitudes = self.flightData.latitudes[idMax:]
        self.flightData.longitudes = self.flightData.longitudes[idMax:]

        #delete zero

        for idx, altitude in sorted(enumerate(self.flightData.altitudes), reverse=True):
            if altitude == 0 or self.flightData.times[idx] == 0 or self.flightData.longitudes[idx] == 0 or self.flightData.latitudes[idx] == 0:
                self.flightData.times.pop(idx)
                self.flightData.altitudes.pop(idx)
                self.flightData.latitudes.pop(idx)
                self.flightData.longitudes.pop(idx)

