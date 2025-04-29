import { bot_template } from "../index";
import { convertMessageContext } from "../../../../lib/telegram/utils";

export const handleBotHelp = () => {
    const { ConvertTeleError, tele_bot } = bot_template
    tele_bot.help(async (ctx) => {
        const { userId, chatId } = convertMessageContext(ctx)
        try {
            //TODO: get cache user language
            // const message = bot_script.template_message({ template: 'detail_all_commands' })
            // ctx.reply(message)
        } catch (error) {
            ConvertTeleError(error, { context_id: chatId }, handleBotHelp.name)
        }
    })
}