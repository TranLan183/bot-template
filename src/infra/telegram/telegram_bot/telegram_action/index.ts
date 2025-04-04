import { Context } from "telegraf";
import { ErrorHandler } from "../../../../lib/error_handler";
import { convertActionContext } from "../../telegrot/utils";
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from "../helper_bot";
import { getDataUserCache } from "../telegram_cache/cache.data_user";
import { BotServiceType } from "../type";


const methodAction = {

}

const handleToListenAction = async (ctx: Context, bot_method: BotServiceType) => {
    const { bot_script, setLastMessageReceivedDate, isBotReadyToStart, ConvertTeleError } = bot_method
    setLastMessageReceivedDate()
    const { callbackData, userId, callbackId, chatId } = convertActionContext(ctx);
    if (!isBotReadyToStart()) {
        return
    }
    try {
        let dataUserSetting = await getDataUserCache(userId)
        if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(userId)
        const [keyCallback] = callbackData.split('&')
        if (methodAction[keyCallback]) await methodAction[keyCallback](ctx, dataUserSetting)
        try {
            bot_script.sendMessage(chatId, {
                template: 'test'
            })
            await ctx.telegram.answerCbQuery(callbackId)
        } catch (err) {
            bot_script.sendMessage(userId, { template: "error" })
        }
    } catch (error) {
        ErrorHandler(error, { callbackData, userId }, handleBotAction.name)
        ConvertTeleError(error, { context_id: callbackId })
    }
}


export const handleBotAction = (bot_method: BotServiceType) => bot_method.tele_bot.on('callback_query', (ctx) => handleToListenAction(ctx, bot_method));