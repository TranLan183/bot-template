import { Context } from "telegraf"
import { MILLISECOND_PER_ONE_SEC } from "../../../../lib/constants"
import { ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext, convertTimeToMDYHM } from "../../telegrot/utils"
import { handleInvalidCacheUserSetting } from "../helper_bot"
import { bot_template } from "../index"
import { getDataUserCache } from "../telegram_cache/cache.data_user"

const listenToHandleStart = async (ctx: Context) => {
    const { ConvertTeleError, bot_script, tele_bot } = bot_template
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
        ErrorHandler(error, { userId, chatId, chatType }, handleBotStart.name)
        ConvertTeleError(error, {
            context_id: chatId,
            language: dataUserSetting?.language
        })
    }
}

export const handleBotStart = () => bot_template.tele_bot.start(listenToHandleStart)