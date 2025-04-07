import { BotServiceType,TUserSetting } from './type'

export const handleInvalidCacheUserSetting = async (bot_method: BotServiceType,userId: string) => {
    const { bot_script } = bot_method
    const dataUserSetting: TUserSetting = {
        user_step: 'finish', language: 'en'
    }
    await bot_script.user_setting.setDataUserCache(userId, dataUserSetting)
    return dataUserSetting
}

export const isCacheUserSettingFieldsMissing = (dataUserSetting: TUserSetting) => {
    const arrFieldUserSetting: (keyof TUserSetting)[] = [
        "user_step", "language"
    ]
    return arrFieldUserSetting.some(key => dataUserSetting[key] === undefined)
}