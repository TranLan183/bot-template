import { Steps } from "."
import { TCacheDataUser } from "../telegram.type"
import { setDataUserCache } from "./telegram_cache/cache.data_user"

export const handleInvalidCacheUserStorage = async (userId: string, username: string) => {
    const dataStorage: TCacheDataUser = { user_step: Steps.finish, language: 'en' }
    await setDataUserCache(userId, dataStorage)
    return dataStorage
}