import { Context } from "telegraf"
import { ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext } from "../../telegrot/utils"
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from "../helper_bot"
import { BotServiceType } from "../type"
import { handlePrivateChat } from "./private_message"
import { handlePublicChat } from "./public_message"

const listenMessageToHandleChatType = async (ctx: Context, bot_method: BotServiceType) => {
    const { bot_start_at, ConvertTeleError, bot_script, handleSpamProtection, isStopListeningFromChatId } = bot_method
    const dataMessageContext = convertMessageContext(ctx)
    const { chatType, chatId, message, userId, timeInSec } = dataMessageContext
    if (timeInSec < (bot_start_at.getTime() / 1000)) return
    let dataUserSetting = await bot_script.cache.user_setting.getDataUserCache(userId)
    if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(bot_method, userId)
    const { language } = dataUserSetting
    try {
        handleSpamProtection(userId)
        if (isStopListeningFromChatId(chatId.toString())) return
        switch (chatType) {
            case "group":
            case "supergroup":
                await handlePublicChat(dataMessageContext, bot_method, dataUserSetting)
                break;
            case "channel":
                break;
            default:
                await handlePrivateChat(dataMessageContext, bot_method, dataUserSetting)
                break;
        }
        return
    } catch (error) {
        ErrorHandler(error, { chatId, userId, message }, listenMessageToHandleChatType.name)
        ConvertTeleError(error, { context_id: chatId, language })
    }
}

export const handleBotMessage = (bot_method: BotServiceType) => bot_method.tele_bot.on("message", (ctx) => listenMessageToHandleChatType(ctx, bot_method))