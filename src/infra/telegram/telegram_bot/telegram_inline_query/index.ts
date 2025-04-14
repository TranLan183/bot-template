import { Context } from "telegraf";
import { BotServiceType } from "../type";
import { ErrorHandler } from "../../../../lib/error_handler";
import { convertInlineContext } from "../../telegrot/utils";

const handleToListenInlineQuery = async (ctx: Context, bot_method: BotServiceType) => {
    const { ConvertTeleError, tele_bot } = bot_method
    const dataContext = convertInlineContext(ctx)
    // const { chatId, userId } = dataContext
    try {

    } catch (error) {
        // ErrorHandler(error, { chatId, userId }, handleBotInlineMode.name)
        // ConvertTeleError(error, { context_id: chatId })
    }
}

export const handleBotInlineMode = (bot_method: BotServiceType) => bot_method.tele_bot.on('inline_query', (ctx) => handleToListenInlineQuery(ctx, bot_method));