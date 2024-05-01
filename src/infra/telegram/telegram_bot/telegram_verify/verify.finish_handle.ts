import { tele_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { SendMessageByBot } from "../../telegram.lib"
import { TDataContext } from "../../telegram.type"
import { bot_script } from "../../telegram_script"
import { TTemplateLanguage } from "../../telegram_script/type"

export const verify_finish_handle = async (dataContext: TDataContext, language?: TTemplateLanguage) => {
    const { userId, chatId, } = dataContext
    try {
        const message = bot_script.template_message({ template: 'finish', language })
        SendMessageByBot(tele_bot, chatId, message)
    } catch (error) {
        ErrorHandler(error, { userId, chatId }, verify_finish_handle.name)
        ConvertTeleError(error, tele_bot, chatId, language)
    }
}
