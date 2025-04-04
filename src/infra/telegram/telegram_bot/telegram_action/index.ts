import { Context } from "telegraf";
import { ErrorHandler } from "../../../../lib/error_handler";
import { convertActionContext } from "../../telegrot/utils";
import { BotServiceType } from "../type";
import { handleInlineKeyboard } from "./inline_keyboard";

const methodAction = {
    btn_inline_keyboard: handleInlineKeyboard
}

const handleToListenAction = async (ctx: Context, bot_method: BotServiceType) => {
    const { bot_script, setLastMessageReceivedDate, isBotReadyToStart, ConvertTeleError, bot_cache } = bot_method
    setLastMessageReceivedDate()
    const { callbackData, userId, callbackId, chatId } = convertActionContext(ctx);
    if (!isBotReadyToStart()) {
        return
    }
    try {
        let dataUserSetting = await bot_cache.getDataUserCache(userId)
        if (!dataUserSetting || bot_cache.isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await bot_cache.handleInvalidCacheUserSetting(userId)
        const [keyCallback] = callbackData.split('&')
        if (methodAction[keyCallback]) await methodAction[keyCallback](ctx, bot_method, dataUserSetting)
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


export const handleBotAction = (bot_method: BotServiceType) => bot_method.tele_bot.on('callback_query', (ctx) => handleToListenAction(ctx, bot_method));