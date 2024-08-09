import { tele_bot } from "..";
import { ErrorHandler } from "../../../../lib/error_handler";
import { ConvertTeleError } from '../../telegram.error';
import { convertMessageContext } from "../../telegram.lib";
import { bot_script } from "../../telegram_script";

export const handleBotHelp = () => {
    tele_bot.help(async (ctx) => {
        const { userId, chatId } = convertMessageContext(ctx)
        try {
            //TODO: get cache user language
            // const message = bot_script.template_message({ template: 'detail_all_commands' })
            // ctx.reply(message)
        } catch (error) {
            ErrorHandler(error, { userId, chatId }, handleBotHelp.name)
            ConvertTeleError(error, tele_bot, chatId)
        }
    })
}