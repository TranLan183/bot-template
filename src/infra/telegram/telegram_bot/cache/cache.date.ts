import { Redis } from "ioredis";
import { TelegramCacheService } from "../../telegrot/cache";

type TCacheDate = {
    date: string
}

class TelegramBotConfigCacheDate extends TelegramCacheService<TCacheDate> {
    private redis: Redis

    constructor(name: string, redis: Redis) {
        super(name)
        this.redis = redis
    }

    setDate = async (userId: string, date: string) => {
        const key = this.createCacheKey(userId)
        await this.redis.set(key, date)
    }

    getDate = async (userId: string): Promise<TCacheDate | null> => {
        const key = this.createCacheKey(userId)
        const data = await this.redis.get(key)
        if (!data) return null
        return JSON.parse(data)
    }
}

export {
    TelegramBotConfigCacheDate
}