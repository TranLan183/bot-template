import { Context } from "telegraf";
import { ErrorHandler } from "../../../../lib/error_handler";
import { convertActionContext } from "../../telegrot/utils";
import { BotServiceType } from "../type";
import { handleInlineKeyboard } from "./inline_keyboard";
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from '../helper_bot'

const methodAction = {
    btn_inline_keyboard: handleInlineKeyboard
}

const handleToListenAction = async (ctx: Context, bot_method: BotServiceType) => {
    const { bot_script, setLastMessageReceivedDate, isBotReadyToStart, ConvertTeleError } = bot_method
    setLastMessageReceivedDate()
    const { callbackData, userId, callbackId, chatId } = convertActionContext(ctx);
    if (!isBotReadyToStart()) {
        return
    }
    try {
        let dataUserSetting = await bot_script.cache.user_setting.getDataUserCache(userId)
        if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(bot_method, userId)
        const [keyCallback] = callbackData.split('&')
        if (methodAction[keyCallback]) await methodAction[keyCallback](ctx, bot_method, dataUserSetting)
        try {
            await ctx.telegram.answerCbQuery(callbackId)
        } catch (err) {
            bot_script.sendMessage(userId, { template: "error" })
        }
    } catch (error) {
        ErrorHandler(error, { callbackData, userId, chatId }, handleBotAction.name)
        ConvertTeleError(error, { context_id: callbackId })
    }
}


export const handleBotAction = (bot_method: BotServiceType) => bot_method.tele_bot.on('callback_query', (ctx) => handleToListenAction(ctx, bot_method));