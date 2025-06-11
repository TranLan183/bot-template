import { Context } from "telegraf"
import { MILLISECOND_PER_ONE_SEC } from "../../../../lib/constants"
import { convertMessageContext, convertTimeToMDYHM } from "../../../../lib/telegram/utils"
import { handleInvalidCacheUserSetting } from "../helper_bot"
import { getDataUserCache } from "../telegram_cache/cache.data_user"
import { BotTemplateServiceType } from "../type"

const listenToHandleStart = async (ctx: Context, bot_method: BotTemplateServiceType) => {
    const { ConvertTeleError, bot_script, tele_bot } = bot_method
    const dataContext = convertMessageContext(ctx)
    const { userId, chatId, chatType, username, timeInSec } = dataContext
    console.table({ userId, username, command: '/Start', timestamp: convertTimeToMDYHM(timeInSec * MILLISECOND_PER_ONE_SEC) })
    let dataUserSetting = await getDataUserCache(userId)
    try {
        if (chatType === "group" || chatType === "supergroup") {
            return
        }
        if (!dataUserSetting) dataUserSetting = await handleInvalidCacheUserSetting(userId)
        const { language } = dataUserSetting

    } catch (error) {
        ConvertTeleError(error, {
            context_id: chatId,
            language: dataUserSetting?.language
        }, listenToHandleStart.name)
    }
}

export const handleBotStart = (bot_method: BotTemplateServiceType) => bot_method.tele_bot.start((ctx) => listenToHandleStart(ctx, bot_method))