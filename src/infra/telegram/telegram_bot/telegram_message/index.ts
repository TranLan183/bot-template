import { Context } from "telegraf"
import { convertMessageContext } from "../../../../lib/telegram/utils"
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from "../helper_bot"
import { getDataUserCache } from "../telegram_cache/cache.data_user"
import { handlePrivateChat } from "./private_message"
import { handlePublicChat } from "./public_message"
import { BotTemplateServiceType } from "../type"

const listenMessageToHandleChatType = async (ctx: Context, bot_method: BotTemplateServiceType) => {
    const { bot_start_at, ConvertTeleError, } = bot_method
    const dataMessageContext = convertMessageContext(ctx)
    const { chatType, chatId, userId, timeInSec } = dataMessageContext
    if (timeInSec < (bot_start_at.getTime() / 1000)) return
    let dataUserSetting = await getDataUserCache(userId)
    if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(userId)
    const { language } = dataUserSetting
    try {
        switch (chatType) {
            case "group":
            case "supergroup":
                await handlePublicChat(ctx, bot_method, dataUserSetting)
                break;
            case "channel":
                break;
            default: {
                await handlePrivateChat(ctx, bot_method, dataUserSetting)
            }
                break;
        }
        return
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, language }, listenMessageToHandleChatType.name)
    }
}

export const handleBotMessage = (bot_method: BotTemplateServiceType) => bot_method.tele_bot.on("message", (ctx) => listenMessageToHandleChatType(ctx, bot_method))