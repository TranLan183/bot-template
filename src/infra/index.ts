import { REDIS_DB_NUMBER, isLocalRun } from "../config";
import { initRedis } from "./cache/redis";
import { connectMongo, mongo } from "./database/mongo/mongo";
import { initSentry } from "./logging/sentry";

const connectInfra = async () => {
    try {
        await Promise.all([
            initSentry(),
            initRedis(REDIS_DB_NUMBER),
        ])
    } catch (e) {
        throw e
    }
}

export {
    connectInfra
};

