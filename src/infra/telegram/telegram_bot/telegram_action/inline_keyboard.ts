import { Context } from "telegraf";
import { ErrorHandler } from "../../../../lib/error_handler";
import { convertActionContext } from "../../telegrot/utils";
import { TUserSetting } from "../telegram_cache/cache.data_user";
import { BotServiceType } from "../type";

export const handleInlineKeyboard = async (ctx: Context, bot_method: BotServiceType, dataUserSetting: TUserSetting) => {
    const { bot_script, ConvertTeleError } = bot_method
    const { callbackData, userId, callbackId, chatId } = convertActionContext(ctx);
    const { language } = dataUserSetting
    try {
        bot_script.sendMessage(chatId, { template: 'reply_btn_inline_keyboard', language })
    } catch (error) {
        ErrorHandler(error, { callbackData, userId }, handleInlineKeyboard.name)
        ConvertTeleError(error, { context_id: chatId, language })
    }
}