import { Context } from "telegraf";
import { convertMessageContext } from "../../../../lib/telegram/utils";
import { BotTemplateServiceType } from "../type";

const handleToListenCommandHelp = async (ctx: Context, bot_method: BotTemplateServiceType) => {
    const { ConvertTeleError, bot_script } = bot_method
    const { chatId, userId, messageId } = convertMessageContext(ctx)
    try {
        // TODO: handle help command
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId }, handleToListenCommandHelp.name)
    }
}

export const handleBotHelp = (bot_method: BotTemplateServiceType) => bot_method.tele_bot.help((ctx) => handleToListenCommandHelp(ctx, bot_method))