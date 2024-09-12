import { ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext, convertTimeToMDYHM } from "../../telegram.lib"
import { TMessageContext } from "../../telegram.type"
import { handleInvalidCacheUserSetting } from "../helper_bot"
import { bot_template } from "../index"
import { getDataUserCache, setDataUserCache } from "../telegram_cache/cache.data_user"

const listenToHandleStart = async (ctx: TMessageContext) => {
    const { ConvertTeleError, bot_script } = bot_template
    const dataContext = convertMessageContext(ctx)
    const { userId, chatId, chatType, username, timeInSec } = dataContext
    console.table({ userId, username, command: '/Start', timestamp: convertTimeToMDYHM(timeInSec) })
    let dataUserStorage = await getDataUserCache(userId)
    try {
        if (chatType === "group" || chatType === "supergroup") {
            return
        }
        if (!dataUserStorage) dataUserStorage = await handleInvalidCacheUserSetting(userId)
        const { language } = dataUserStorage
        bot_script.sendMessage(chatId, {
            template: 'welcome',
            reply_markup: true,
            parse_mode: true,
            language
        })
        await setDataUserCache(userId, { user_step: 'finish' })
    } catch (error) {
        ErrorHandler(error, { userId, chatId, chatType }, handleBotStart.name)
        ConvertTeleError(error, {
            context_id: chatId,
            language: dataUserStorage?.language
        })
    }
}

export const handleBotStart = () => bot_template.tele_bot.start(listenToHandleStart)