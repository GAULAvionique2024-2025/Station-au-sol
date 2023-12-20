import asyncio
import websockets
import csv
import time
import json
import os


# Change directory to current file directory
os.chdir(os.path.dirname(os.path.realpath(__file__)))


# Data class to read data from log.txt
class Data:
    def __init__(self):
        self.datalist = self.read_datalist()
        self.i = 0
        self.max_i = len(self.datalist) - 1
        self.lasttime = time.time()

    @staticmethod
    def read_datalist():
        datalist = []
        with open("log.txt", "r") as file:
            reader = list(csv.reader(file))
            # Remove Header
            reader.pop(0)
            # Create data
            for row in reader:
                datalist.append({
                    "time": row[0],
                    "altitude": row[1],
                    "pitch": row[2],
                    "roll": row[3],
                    "yaw": row[4],
                    "lat": row[5],
                    "lon": row[6],
                    "speed": row[7],
                    "acceleration": row[8],
                    "temperature": row[9],
                    "vibrations": row[10],
                    "landing_force": row[11],
                    "batt_check": row[12],
                    "igniter_check": row[13],
                    "gps_check": row[14],
                })
            return datalist

    def get_new_data(self):
        if self.i <= self.max_i:
            data = self.datalist[self.i]
        else:
            self.i = 0
            data = self.datalist[self.i]
        self.i += 1
        return data

    async def fetch_new_data(self):
        # Calculate delta time between current data and last data
        data_time = float(
            self.datalist[self.i if self.i <= self.max_i else 0]["time"]
        )
        last_data_time = float(
            self.datalist[self.i - 1]["time"]
        )
        dt = data_time - last_data_time
        # Check if timenow > lasttime + dt
        if time.time() > self.lasttime + dt:
            self.lasttime = time.time()
            return self.get_new_data()
        else:
            await asyncio.sleep(self.lasttime + dt - time.time())
            self.lasttime = time.time()
            return self.get_new_data()


# Create handler for each connection (send data to client)
async def handler(websocket):
    new_data = Data()
    async for message in websocket:
        print("Received: " + message)
        if message == "OK":
            data = await new_data.fetch_new_data()
            try:
                await websocket.send(json.dumps(data))
            except websockets.exceptions.ConnectionClosed:
                print("Connection closed")
                break
            print("Sent: " + str(data))


# Create websocket server
async def main():
    async with websockets.serve(handler, "localhost", 8000):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
