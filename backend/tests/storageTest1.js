import MyData from "../src/data.mjs";
import fs from "fs";
import { Transform } from "stream";
const data = new MyData();

// Read the file in chunks
const readStream = fs.createReadStream("../../DATA/2024-08-19_005016_raw.txt", { encoding: "utf8" });

readStream.on("data", (chunk) => {
    // Pass each chunk to the handleRawData function
    const buffer = Buffer.from(chunk);
    data.handleRawData(buffer);
});

readStream.on("end", () => {
    console.log("File reading completed.");
});

readStream.on("error", (err) => {
    console.error("Error reading file:", err);
});
