import { setDataUserCache, TUserSetting } from "./cache/cache.data_user"

export const handleInvalidCacheUserSetting = async (userId: string) => {
    const dataUserSetting: TUserSetting = {
        user_step: 'finish', language: 'en',
    }
    await setDataUserCache(userId, dataUserSetting)
    return dataUserSetting
}

export const isCacheUserSettingFieldsMissing = (dataUserSetting: TUserSetting) => {
    const arrFieldUserSetting: (keyof TUserSetting)[] = [
        "user_step", "language"
    ]
    return arrFieldUserSetting.some(key => dataUserSetting[key] === undefined)
}