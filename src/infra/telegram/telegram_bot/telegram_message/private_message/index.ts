import { bot_template } from "../../index";
import { ErrorHandler } from "../../../../../lib/error_handler";
import { TDataContext, TTemplateLanguage } from "../../../telegrot/type";
import { TUserSetting } from "../../telegram_cache/cache.data_user";

export const BotTradingSteps = {
    welcome: "welcome",
    finish: "finish",
}

const isButtonMessage = (message: string, language?: TTemplateLanguage) => {
    return [''].includes(message) || message.startsWith('/')
}

const messageActionKeyBoard = async (dataMessageContext: TDataContext, language?: TTemplateLanguage) => {
    const { message, chatId, userId, userFirstName, username, userFullName } = dataMessageContext
    const { ConvertTeleError, bot_script } = bot_template
    try {
        switch (message) {

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

const messageVerifyStep = async (dataMessageContext: TDataContext, dataUserSetting: TUserSetting) => {
    const { message, userId, chatId } = dataMessageContext
    const { user_step, language } = dataUserSetting
    const { ConvertTeleError, bot_script } = bot_template
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

export const handlePrivateChat = async (dataMessageContext: TDataContext, dataUserSetting: TUserSetting) => {
    const { userId, chatId, message } = dataMessageContext
    const { language } = dataUserSetting
    const { ConvertTeleError } = bot_template
    try {
        if (isButtonMessage(message, language)) {
            await messageActionKeyBoard(dataMessageContext, language)
        } else {
            await messageVerifyStep(dataMessageContext, dataUserSetting)
        }
    } catch (error) {
        ErrorHandler(error, { chatId, userId }, handlePrivateChat.name)
        ConvertTeleError(error, { context_id: chatId, language })
    }
}
