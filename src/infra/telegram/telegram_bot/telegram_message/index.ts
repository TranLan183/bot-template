import { ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext } from "../../telegram.lib"
import { TMessageContext } from "../../telegram.type"
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from "../helper_bot"
import { bot_template } from "../index"
import { getDataUserCache } from "../telegram_cache/cache.data_user"
import { handlePrivateChat } from "./private_message"
import { handlePublicChat } from "./public_message"

const listenMessageToHandleChatType = async (ctx: TMessageContext) => {
    const { bot_start_at, ConvertTeleError, } = bot_template
    const dataMessageContext = convertMessageContext(ctx)
    const { chatType, chatId, message, userId, timeInSec } = dataMessageContext
    if (timeInSec < (bot_start_at.getTime() / 1000)) return
    let dataUserSetting = await getDataUserCache(userId)
    if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(userId)
    const { language } = dataUserSetting
    try {
        switch (chatType) {
            case "group":
            case "supergroup":
                await handlePublicChat(dataMessageContext, dataUserSetting)
                break;
            case "channel":
                break;
            default: {
                await handlePrivateChat(dataMessageContext, dataUserSetting)
            }
                break;
        }
        return
    } catch (error) {
        ErrorHandler(error, { chatId, userId, message }, listenMessageToHandleChatType.name)
        ConvertTeleError(error, { context_id: chatId, language })
    }
}

export const handleBotMessage = () => bot_template.tele_bot.on("message", listenMessageToHandleChatType)