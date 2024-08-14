import moment from "moment";

export default function logger(...message) {
    console.log(`[${moment().format("HH:mm:ss")}]`, ...message);
}
