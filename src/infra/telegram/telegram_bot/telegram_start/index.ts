import { Context } from "telegraf"
import { MILLISECOND_PER_ONE_SEC } from "../../../../lib/constants"
import { ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext, convertTimeToMDYHM } from "../../telegrot/utils"
import { BotServiceType } from "../type"
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from '../helper_bot'

const listenToHandleStart = async (ctx: Context, bot_method: BotServiceType) => {
    const { ConvertTeleError, bot_script } = bot_method
    const dataContext = convertMessageContext(ctx)
    const { userId, chatId, chatType, username, timeInSec } = dataContext
    console.table({ userId, username, command: '/Start', timestamp: convertTimeToMDYHM(timeInSec * MILLISECOND_PER_ONE_SEC) })
    let dataUserStorage = await bot_script.user_setting.getDataUserCache(userId)
    try {
        if (chatType === "group" || chatType === "supergroup") {
            return
        }
        if (!dataUserStorage) dataUserStorage = await handleInvalidCacheUserSetting(bot_method, userId)
        const { language } = dataUserStorage
        bot_script.sendMessage(chatId, {
            template: 'welcome',
            reply_markup: true,
            parse_mode: true,
            language
        })
        await bot_script.user_setting.setDataUserCache(userId, { user_step: 'finish' })
    } catch (error) {
        ErrorHandler(error, { userId, chatId, chatType }, handleBotStart.name)
        ConvertTeleError(error, {
            context_id: chatId,
            language: dataUserStorage?.language
        })
    }
}

export const handleBotStart = (bot_method: BotServiceType) => bot_method.tele_bot.start((ctx) => listenToHandleStart(ctx, bot_method))