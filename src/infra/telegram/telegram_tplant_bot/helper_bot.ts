import { Steps } from "."
import { TCacheDataUser } from "../telegram.type"
import { setUserStorage } from "./telegram_cache/cache.data_user"

export const handleInvalidCacheUserStorage = async (userId: string, username: string) => {
    const dataStorage: TCacheDataUser = { user_step: Steps.finish, language: 'en' }
    await setUserStorage(userId, dataStorage)
    return dataStorage
}