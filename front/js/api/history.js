import { fetcher } from "../utils/requester.js";
import { events } from "../events/events.js";

const api = fetcher();
const rootPath = "http://13.39.75.52";

// Get History
export const gameHistory = async () => {
    try {
        const res = await api.get(rootPath + "/api/history", {});
        console.log(res)
        return res.history;
    } catch (err) {
        console.log(err);
    }
};
