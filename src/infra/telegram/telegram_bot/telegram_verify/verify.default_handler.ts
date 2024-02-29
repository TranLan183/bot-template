import { game_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { SendMessageByBot } from "../../telegram.lib"
import { TDataContext } from "../../telegram.type"
import { bot_script } from "../../telegram_template"
import { TTemplateLanguage } from "../../telegram_template/type"

export const verify_default_handler = async (dataContext: TDataContext, language?: TTemplateLanguage) => {
    const { userId, chatId, userFullName, message } = dataContext
    try {
        console.log(`${userId}-${userFullName}: ${message}`)
        SendMessageByBot(game_bot, chatId, bot_script.template_message({ template: 'unknown_command', language }))
    } catch (e) {
        ErrorHandler(e, { message, userId, userFullName, chatId }, verify_default_handler.name)
        ConvertTeleError(e, game_bot, chatId, language)
    }
}