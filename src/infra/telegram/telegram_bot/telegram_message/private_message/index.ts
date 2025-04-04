import { ErrorHandler } from "../../../../../lib/error_handler";
import { TDataContext, TTemplateLanguage } from "../../../telegrot/type";
import { TUserSetting } from "../../telegram_cache/cache.data_user";
import { BotServiceType } from "../../type";

export const BotTradingSteps = {
    welcome: "welcome",
    finish: "finish",
}

const isButtonKeyboardMessage = (bot_method: BotServiceType, message: string, language?: TTemplateLanguage) => {
    const { bot_script } = bot_method
    return [
        bot_script.template_message({ template: 'btn_kb_keyboard', language }),
        bot_script.template_message({ template: 'btn_kb_inline_keyboard', language })
    ].includes(message) || message.startsWith('/')
}

const messageActionKeyBoard = async (dataMessageContext: TDataContext, bot_method: BotServiceType, dataUserSetting: TUserSetting) => {
    const { message, chatId, userId, userFirstName, username, userFullName } = dataMessageContext
    const { ConvertTeleError, bot_script } = bot_method
    const { language } = dataUserSetting
    try {
        switch (message) {
            case bot_script.template_message({ template: 'btn_kb_keyboard', language }):
                bot_script.sendMessage(chatId, { template: 'reply_btn_kb_keyboard', language })
                break
            case bot_script.template_message({ template: 'btn_kb_inline_keyboard', language }):
                bot_script.sendMessage(chatId, { template: 'reply_btn_kb_inline_keyboard', reply_markup: true, language })
                break
            default:
                if (message.startsWith('/')) bot_script.sendMessage(chatId, { template: 'unknown_command', language })
                break
        }
    } catch (error) {
        ErrorHandler(error, { message, userId, chatId }, messageVerifyStep.name)
        ConvertTeleError(error, {
            context_id: chatId,
            language
        })
    }
}

const messageVerifyStep = async (dataMessageContext: TDataContext, bot_method: BotServiceType, dataUserSetting: TUserSetting) => {
    const { message, userId, chatId } = dataMessageContext
    const { user_step, language } = dataUserSetting
    const { ConvertTeleError, bot_script } = bot_method
    try {
        switch (user_step) {
            default:
                if (!message.startsWith('/')) await bot_script.sendMessage(chatId, { template: 'unknown_command', language })
                break
        }
    } catch (error) {
        ErrorHandler(error, { message, userId, chatId }, messageVerifyStep.name)
        ConvertTeleError(error, { context_id: chatId, language })
    }
}

export const handlePrivateChat = async (dataMessageContext: TDataContext, bot_method: BotServiceType, dataUserSetting: TUserSetting) => {
    const { userId, chatId, message } = dataMessageContext
    const { language } = dataUserSetting
    const { ConvertTeleError } = bot_method
    try {
        if (isButtonKeyboardMessage(bot_method, message, language)) {
            await messageActionKeyBoard(dataMessageContext, bot_method, dataUserSetting)
        } else {
            await messageVerifyStep(dataMessageContext, bot_method, dataUserSetting)
        }
    } catch (error) {
        ErrorHandler(error, { chatId, userId }, handlePrivateChat.name)
        ConvertTeleError(error, { context_id: chatId, language })
    }
}
