import asyncio
import websockets
import csv


async def new_data():
    # Read logs
    with open("log.txt", "r") as file:
        reader = list(csv.reader(file))
        # Remove Header
        reader.pop(0)
        # Send data each second
        for row in reader:
            await asyncio.sleep(1)
            return {
                "time": row[0],
                "alt": row[1],
                "pitch": row[2],
                "roll": row[3],
                "yaw": row[4],
            }




# create handler for each connection (send data to client)
async def handler(websocket):
    async for message in websocket:
        if message == "OK":
            data = await new_data()
            await websocket.send(data)


# create server
async def main():
    async with websockets.serve(handler, "localhost", 8000):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
