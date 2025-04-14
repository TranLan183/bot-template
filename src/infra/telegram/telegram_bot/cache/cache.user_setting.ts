import { successConsoleLog } from "../../../../lib/color-log";
import { TelegramCacheService } from "../../telegrot/cache";
import { TUserSetting } from "../type";
import Redis from 'ioredis'
import { ITelegramCache } from "../../telegrot/type";

class TelegramBotConfigCache extends TelegramCacheService<TUserSetting> implements ITelegramCache<TUserSetting> {

    private redis: Redis

    constructor(bot_name: string, redis_instance: Redis) {
        super(bot_name)
        this.redis = redis_instance
    }


    getDataUserCache = async (userId: string): Promise<TUserSetting | null> => {
        try {
            const key = this.createCacheKey(userId)
            const result = await this.redis.get(key)
            return result ? JSON.parse(result) : null
        } catch (e) {
            throw e
        }
    }

    setDataUserCache = async (userId: string, args: Partial<TUserSetting>) => {
        try {
            const key = this.createCacheKey(userId)
            const json_str = await this.getDataUserCache(userId) || args
            Object.assign(json_str, args)
            await this.redis.set(key, JSON.stringify(json_str))
            return
        } catch (e) {
            throw e
        }
    }

    delDataUserCache = async (userId: string, fields?: (keyof TUserSetting)[]) => {
        const key = this.createCacheKey(userId)
        const json_str = await this.getDataUserCache(userId)
        if (fields) {
            if (!json_str) return
            fields.forEach(item => delete json_str[item])
            await this.redis.set(key, JSON.stringify(json_str))
        } else {
            await this.redis.del(key)
        }
        return
    }

    getUserSetting = async (userId: string) => {
        const data = await this.getDataUserCache(userId)
        return data
    }
}

export {
    TelegramBotConfigCache
}