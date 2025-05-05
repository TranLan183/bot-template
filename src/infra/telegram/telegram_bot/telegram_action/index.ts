import { Context } from "telegraf";
import { convertActionContext } from "../../../../lib/telegram/utils";
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from "../helper_bot";
import { getDataUserCache } from "../telegram_cache/cache.data_user";
import { BotTemplateServiceType } from "../type";

const methodAction = {

}

const listenCallbackQueryToHandleAction = async (ctx: Context, bot_method: BotTemplateServiceType) => {
    const { setLastMessageReceivedDate, isBotReadyToStart, ConvertTeleError, bot_script } = bot_method
    setLastMessageReceivedDate()
    const { callbackData, userId, callbackId, username, timeInSec, chatId } = convertActionContext(ctx);
    if (!isBotReadyToStart()) {
        return
    }
    try {
        let dataUserSetting = await getDataUserCache(userId)
        if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(userId)
        const [keyCallback] = callbackData.split('&')
        if (methodAction[keyCallback]) await methodAction[keyCallback](ctx, dataUserSetting)
        try {
            await ctx.telegram.answerCbQuery(callbackId)
        } catch (err) {
            bot_script.sendMessage(userId, { template: "error" })
        }
    } catch (error) {
        ConvertTeleError(error, { context_id: callbackId }, listenCallbackQueryToHandleAction.name)
    }
}

export const handleBotAction = (bot_method: BotTemplateServiceType) => bot_method.tele_bot.on('callback_query', (ctx) => listenCallbackQueryToHandleAction(ctx, bot_method));