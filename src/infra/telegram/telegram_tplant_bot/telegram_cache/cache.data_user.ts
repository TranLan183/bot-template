import { create_key_with_prefix } from "../../../cache"
import { ioredis } from "../../../cache/redis"
import { TCacheDataUser } from "../../telegram.type"

const DEFAULT_KEY_BUY_ENERGY = "DATA_USER_CACHE"

const createCacheKey = (value: string) => create_key_with_prefix(`telegram.${DEFAULT_KEY_BUY_ENERGY}_${value}`)

export const getDataUserCache = async (userId: string): Promise<TCacheDataUser | null> => {
    try {
        const key = createCacheKey(userId)
        const result = await ioredis.get(key)
        return result ? JSON.parse(result) : null
    } catch (e) {
        throw e
    }
}
export const setDataUserCache = async (userId: string, args: TCacheDataUser) => {
    try {
        const key = createCacheKey(userId)
        const result = await ioredis.set(key, JSON.stringify(args))
        return result
    } catch (e) {
        throw e
    }
}

export const delDataUserCache = async (userId: string) => {
    const key = createCacheKey(userId)
    const result = await ioredis.del(key)
    return result
}