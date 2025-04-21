import { Context } from "telegraf";
import { ErrorHandler } from "../../../../lib/error_handler";
import { convertMessageContext } from "../../telegrot/utils";
import { BotServiceType } from "../type";

const handleToListenCommandHelp = async (ctx: Context, bot_method: BotServiceType) => {
    const { ConvertTeleError, bot_script, isStopListeningFromChatId } = bot_method
    const dataContext = convertMessageContext(ctx)
    const { userId, chatId } = dataContext
    if (isStopListeningFromChatId(chatId.toString())) return
    try {
        //TODO: get cache user language
        // const message = bot_script.template_message({ template: 'detail_all_commands' })
        // ctx.reply(message)
    } catch (error) {
        ErrorHandler(error, { userId, chatId }, handleBotHelp.name)
        ConvertTeleError(error, { context_id: chatId })
    }
}

export const handleBotHelp = (bot_method: BotServiceType) => bot_method.tele_bot.help((ctx) => handleToListenCommandHelp(ctx, bot_method))