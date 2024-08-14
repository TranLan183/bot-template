import { create_key_with_prefix } from "../../../cache"
import { ioredis } from "../../../cache/redis"
import { TCacheDataUser } from "../../telegram.type"

const DEFAULT_KEY_BUY_ENERGY = "DATA_USER_CACHE"

const createCacheKey = (value: string) => create_key_with_prefix(`telegram.${DEFAULT_KEY_BUY_ENERGY}_${value}`)

export type TUserSetting = TCacheDataUser

export const getDataUserCache = async (userId: string): Promise<TUserSetting | null> => {
    try {
        const key = createCacheKey(userId)
        const result = await ioredis.get(key)
        return result ? JSON.parse(result) : null
    } catch (e) {
        throw e
    }
}

export const setDataUserCache = async (userId: string, args: Partial<TUserSetting>) => {
    try {
        const key = createCacheKey(userId)
        const json_str = await getDataUserCache(userId) || args
        Object.assign(json_str, args)
        const result = await ioredis.set(key, JSON.stringify(json_str))
        return result
    } catch (e) {
        throw e
    }
}

export const delDataUserCache = async (userId: string, fields?: (keyof TUserSetting)[]) => {
    const key = createCacheKey(userId)
    const json_str = await getDataUserCache(userId)
    if (fields) {
        if (!json_str) return
        fields.forEach(item => delete json_str[item])
        await ioredis.set(key, JSON.stringify(json_str))
    } else {
        await ioredis.del(key)
    }
    return
}