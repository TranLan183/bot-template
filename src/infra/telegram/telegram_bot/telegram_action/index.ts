import { bot_template } from "../index";
import { ErrorHandler } from "../../../../lib/error_handler";
import { convertActionContext } from "../../telegrot/utils";
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from "../helper_bot";
import { getDataUserCache } from "../telegram_cache/cache.data_user";
import { Context } from "telegraf";


const methodAction = {

}

const listenCallbackQueryToHandleAction = async (ctx: Context) => {
    const { tele_bot, setLastMessageReceivedDate, isBotReadyToStart, ConvertTeleError, bot_script } = bot_template
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
        ErrorHandler(error, { callbackData, userId }, handleBotAction.name)
        ConvertTeleError(error, { context_id: callbackId })
    }
}

export const handleBotAction = () => bot_template.tele_bot.on('callback_query', listenCallbackQueryToHandleAction);